import std/asynchttpserver
import std/asyncdispatch
import std/json
import std/httpclient
import std/sequtils
import std/sugar
import std/uri
from std/strformat import `&`
from std/strutils import split

import server/images

from pixie import Image, PixieError


proc onProgressChanged(total, progress, speed: BiggestInt) {.async.} =
  echo(&"Downloaded {progress} of {total}")
  echo(&"Current rate: {float(speed):.3g} b/s")

  discard 


proc main* {.async.} =
  var
    server: AsyncHttpServer = newAsyncHttpServer()
    client: AsyncHttpClient = newAsyncHttpClient()

  let collage = RectCollage()

  client.onProgressChanged = onProgressChanged

  proc generateCollage(req: Request) {.async.} =

    stderr.write(&"{dumpToString(req)}\L")

    var matrix: seq[seq[Uri]]
    for row in req.url.query.split('&'):
      matrix.add(newSeq[Uri]())
      for url in row.split(';'):
        let uri = parseUri(decodeUrl(url))

        if uri.scheme notin ["http", "https"] :
          await req.respond(Http400, &"'{uri}' must use HTTP(S) scheme{httpNewLine}")
          return
        if uri.username != "":
          await req.respond(Http400, &"'{uri}' cannot have username{httpNewLine}")
          return
        if uri.password != "":
          await req.respond(Http400, &"'{uri}' cannot have password{httpNewLine}")
          return

        matrix[^1].add(uri)


    var
      futureResponses: seq[seq[Future[AsyncResponse]]]
      futureBodies: seq[seq[Future[string]]]


    newSeq(futureResponses, matrix.len)
    newSeq(futureBodies, matrix.len)

    for i, row in matrix.pairs:
      newSeq(futureResponses[i], row.len)
      newSeq(futureBodies[i], row.len)

      for j, url in row.pairs:
        futureResponses[i][j] = client.get(url)

        capture i, j:
          proc setUrl(resp: Future[AsyncResponse]) =
            futureBodies[i][j] = newFuture[string]("setUrl");
            if resp.failed():
              futureBodies[i][j].fail(resp.readError())
            elif not resp.read().code().is2xx():
              futureBodies[i][j].fail(newException(ValueError, resp.read().status))
            else:
              futureBodies[i][j] = resp.read().body()

          addCallback(futureResponses[i][j], setUrl)

    var futureRows: seq[Future[seq[string]]]
    newSeq(futureRows, futureBodies.len)
    for i, row in futureBodies.pairs:
      futureRows[i] = all(row)

    let bodies: seq[seq[string]] = await all(futureRows)


    var collageImage: string
    try:
      collageImage = collage.collagify(bodies)
    except CollageError:
      await req.respond(Http400, &"{getCurrentExceptionMsg()}\L")
    except PixieError:
      await req.respond(Http400, &"{getCurrentExceptionMsg()}\L")

    let headers = newHttpHeaders({"Content-Type" : "image/png"})

    echo "HERE"
    await req.respond(Http200, collageImage, headers)


  proc callback(req: Request) {.async.} =

    case req.reqMethod:
      of HttpOptions:
        let headers = {"Allow": "OPTIONS, GET"}
        await req.respond(Http204, "", headers.newHttpHeaders(titleCase=true))
      of HttpGet:
        await generateCollage(req)
      else:
        await req.respond(Http400, "400 Bad Request", newHttpHeaders(titleCase=true))

  server.listen(Port(8080))
  while true:
    if server.shouldAcceptRequest():
      await server.acceptRequest(callback)
    else:
      # too many concurrent connections, `maxFDs` exceeded
      # wait 500ms for FDs to be closed
      await sleepAsync(500)



when isMainModule:
  waitFor main()
