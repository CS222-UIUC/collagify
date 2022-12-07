import std/asynchttpserver
import std/asyncdispatch
import std/httpclient
import std/sugar
import std/uri
from std/strformat import `&`
from std/strutils import split

import server/images

from pixie import Image, PixieError





proc main* {.async.} =
  var
    server: AsyncHttpServer = newAsyncHttpServer()


  proc generateCollage(req: Request) {.async.} =
    ## Handles GET requests

    # prints request details to stderr
    stderr.write(&"{dumpToString(req)}\L")

    # matrix of urls, based on the dimensions passed in the query string
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

    # # prints contents of matrix url, I need to make sure they're decoded properly
    # dump matrix

    var
      futureResponses: seq[seq[Future[AsyncResponse]]]

    newSeq(futureResponses, matrix.len)
    for i, row in matrix.pairs:
      newSeq(futureResponses[i], row.len)
      for j, url in row.pairs:
        # we need a http client to GET the Spotify images
        var client: AsyncHttpClient = newAsyncHttpClient()
        futureResponses[i][j] = client.get(url)

    # at this point, futureResponses has a bunch of promises to get the contents of each image
    for i, row in futureResponses.pairs:
      for j, response in row.pairs:
        discard await response

    # now, futureResponses has fully gotten each image

    # error checking for each image download response
    for i, row in futureResponses.pairs:
      for j, response in row.pairs:
        if response.failed():
          await req.respond(Http502, &"\"{matrix[i][j]}\": {response.readError().msg}")
          return
        if not response.read().code().is2xx():
          await req.respond(Http502, &"\"{matrix[i][j]}\": {response.read().status}")
          return

    # bodies is the actual image data extracted from each repsonse
    var bodies: seq[seq[string]]

    newSeq(bodies, matrix.len)
    for i, row in futureResponses.pairs:
      newSeq(bodies[i], row.len)
      for j, response in row.pairs:
        bodies[i][j] = await response.read().body()


    var collageImage: string
    try:
      # allows crop collage instead of a strict rectangle collage
      if req.url.path == "/crop":
        collageImage = collagify(CropCollage(), bodies)
      else:
        collageImage = collagify(RectCollage(), bodies)
    except CollageError:
      await req.respond(Http400, &"{getCurrentExceptionMsg()}\L")
    except PixieError:
      await req.respond(Http400, &"{getCurrentExceptionMsg()}\L")

    let headers = newHttpHeaders({"Content-Type" : "image/png"})

    # collage was successfully generated
    await req.respond(Http200, collageImage, headers)


  proc callback(req: Request) {.async.} =

    case req.reqMethod:
      of HttpOptions:
        let headers = {"Allow": "OPTIONS, GET"}
        await req.respond(Http204, "", headers.newHttpHeaders(titleCase=true))
      of HttpGet:
        await generateCollage(req)
      else:
        # whatever method passed is not allowed/supported
        await req.respond(Http400, "400 Bad Request", newHttpHeaders(titleCase=true))

  # port is 8080
  server.listen(Port(8080))
  while true:
    if server.shouldAcceptRequest():
      await server.acceptRequest(callback)
    else:
      # too many concurrent connections, `maxFDs` exceeded
      # wait 500ms for FDs to be closed
      await sleepAsync(500)



when isMainModule:
  # main handles asynchronous events forver 
  waitFor main()
