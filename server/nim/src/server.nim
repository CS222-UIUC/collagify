import std/asynchttpserver
import std/asyncdispatch
import std/json
import std/httpclient
import std/sequtils
import std/uri
from std/strformat import `&`
from std/strutils import split
from std/sugar import collect

import server/images


proc onProgressChanged(total, progress, speed: BiggestInt) {.async.} =
  echo(&"Downloaded {progress} of {total}")
  echo(&"Current rate: {float(speed):.3g} b/s")

  discard 


proc main* {.async.} =
  var
    server: AsyncHttpServer = newAsyncHttpServer()
    client: AsyncHttpClient = newAsyncHttpClient()

  client.onProgressChanged = onProgressChanged

  proc generateCollage(req: Request) {.async.} =

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

    if matrix.len == 0:
      await req.respond(Http400, &"Must have at least 1 row{httpNewLine}")
      return

    if matrix.anyIt(it.len == 0):
      await req.respond(Http400, &"Cannot have empty rows{httpNewLine}")
      return

    if matrix.len == 1 and matrix[0].len == 1:
      await req.respond(Http400, &"Must have at least 1 image{httpNewLine}")
      return

    echo pretty(%* matrix)

    var contents: seq[seq[string]]
    newSeq(contents, matrix.len)
    for i, row in matrix.pairs:
      newSeq(contents[i], row.len)



    await req.respond(Http200, "Bruh")
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
