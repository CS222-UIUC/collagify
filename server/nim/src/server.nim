import std/asynchttpserver
import std/asyncdispatch
import std/httpclient
import std/sugar
import std/uri
from std/strformat import `&`
from std/strutils import split

import server/images

from pixie import Image, PixieError


proc onProgressChanged(total, progress, speed: BiggestInt) {.async.} =
  echo(&"Downloaded {progress} of {total}")
  echo(&"Current rate: {float(speed):.3g} b/s")



proc main* {.async.} =
  var
    server: AsyncHttpServer = newAsyncHttpServer()
    client: AsyncHttpClient = newAsyncHttpClient()

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

    dump matrix

    var
      futureResponses: seq[seq[Future[AsyncResponse]]]

    newSeq(futureResponses, matrix.len)
    for i, row in matrix.pairs:
      newSeq(futureResponses[i], row.len)
      for j, url in row.pairs:
        futureResponses[i][j] = client.get(url)

    for i, row in futureResponses.pairs:
      for j, response in row.pairs:
        discard await response

    for i, row in futureResponses.pairs:
      for j, response in row.pairs:
        if response.failed():
          await req.respond(Http502, &"\"{matrix[i][j]}\": {response.readError().msg}")
          return
        if not response.read().code().is2xx():
          await req.respond(Http502, &"\"{matrix[i][j]}\": {response.read().status}")
          return

    var bodies: seq[seq[string]]

    newSeq(bodies, matrix.len)
    for i, row in futureResponses.pairs:
      newSeq(bodies[i], row.len)
      for j, response in row.pairs:
        bodies[i][j] = await response.read().body()


    var collageImage: string
    try:
      if req.url.path == "/crop":
        collageImage = collagify(CropCollage(), bodies)
      else:
        collageImage = collagify(RectCollage(), bodies)
    except CollageError:
      await req.respond(Http400, &"{getCurrentExceptionMsg()}\L")
    except PixieError:
      await req.respond(Http400, &"{getCurrentExceptionMsg()}\L")

    let headers = newHttpHeaders({"Content-Type" : "image/png"})

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
