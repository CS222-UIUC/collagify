from std/sequtils import anyIt, allIt, mapIt, foldl
from std/sugar import collect, dump


import pixie
import vmath



type
  # Colalge is a abstract base class
  Collage* {.inheritable.} = object
  RectCollage* = object of Collage
  CropCollage* = object of RectCollage
  # ScaledCollage* = object of RectCollage
  # CropAndScaleCollage* = object of RectCollage

  CollageError* = object of ValueError




method fillCanvas*(collage: Collage; imageGrid: openArray[seq[Image]]): Image {.base.} =
  # you shouldn't call this on the abstract bass class
  raise newException(CollageError, "Don't use an abstract base Collage class")

method fillCanvas*(collage: RectCollage; imageGrid: openArray[seq[Image]]): Image =
  ## Returns a simple collage
  ## Each image must have the exact dimensions

  let rowLength = imageGrid[0].len
  if not allIt(imageGrid[1..^1], it.len == rowLength):
    raise newException(CollageError, "Input must have consistent number of columns")

  let
    pieceWidth = imageGrid[0][0].width
    pieceHeight = imageGrid[0][0].height

  for row in imageGrid:
    for image in row:
      if not (image.width == pieceWidth and image.height == pieceHeight):
        raise newException(CollageError, "All images must be the same size")

  # we can easily calculate the collage's dimensions with multiplication
  let
    resultWidth = pieceWidth * imageGrid[0].len
    resultHeight = pieceHeight * imageGrid.len

  # this is a pixie class that lets us "draw" with it
  var resultContext = newContext(resultWidth, resultHeight)

  for row, imageRow in imageGrid.pairs:
    for col, image in imageRow.pairs:
      drawImage(resultContext, image, vec2(float32(row * pieceWidth), float32(col * pieceHeight)))

  return resultContext.image




func quickCrop(image: Image; bounds: UVec2): Image =
  ## crops image to the specified bounds. The middle of the image is returned.
  let orgBounds = uvec2(uint32(image.width), uint32(image.height))
  let pos = (orgBounds - bounds) div 2'u32
  image.subImage(int(pos[0]), int(pos[1]), int(bounds[0]), int(bounds[1]))

method fillCanvas*(collage: CropCollage; imageGrid: openArray[seq[Image]]): Image =
  ## Returns a collage that accounts for some images having different dimensions

  # resultBounds is the minimum width and height of all of the images
  var resultBounds = uvec2(high(uint32), high(uint32))

  for row in imageGrid:
    resultBounds[0] = foldl(row, min(a, uint32(b.width)), resultBounds[0])
    resultBounds[1] = foldl(row, min(a, uint32(b.height)), resultBounds[1])

  # croppedImageGrid is the matrix of each image cropped
  let croppedImageGrid = collect:
    for row in imageGrid:
      collect:
        for image in row:
          quickCrop(image, resultBounds)

  # pass croppedImageGrid to fillCanvas as a RectCollage to generate the collage
  return procCall fillCanvas(RectCollage(collage), croppedImageGrid)








proc collagify*(collage: Collage; imageGrid: openArray[seq[Image]]): Image =
  ## Takes a matrix of pixie.Image s, return's a pixie.Image collage
  ## This procedure only does "bounds checking" then passes it to fillCanvas
  if imageGrid.len == 0:
    raise newException(CollageError, "Input must have at least 1 row")

  if anyIt(imageGrid, it.len == 0):
    raise newException(CollageError, "Input cannot have empty rows")

  if imageGrid.len == 1 and imageGrid[0].len == 1:
    raise newException(CollageError, "Input must have at least 2 images")

  return fillCanvas(collage, imageGrid)




proc collagify*(collage: Collage; imageGrid: openArray[seq[string]]; fileFormat: FileFormat = PngFormat): string =
  ## Takes a matrix of binary image data and a collage type, returns the collage (default format is PNG)
  ## You can also specify the file format of the output collage
  let decodedImageGrid: seq[seq[Image]] = collect:
    for row in imageGrid:
      collect:
        for image in row:
          let decodedImage = image.decodeImage()
          decodedImage.subImage(decodedImage.opaqueBounds())

  return encodeImage(collage.collagify(decodedImageGrid), fileFormat)
