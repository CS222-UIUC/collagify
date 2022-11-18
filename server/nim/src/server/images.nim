from std/sequtils import anyIt, allIt, mapIt, foldl
from std/sugar import collect, dump


import pixie
import vmath



type
  Collage* {.inheritable.} = object
  RectCollage* = object of Collage
  CropCollage* = object of RectCollage
  ScaledCollage* = object of RectCollage
  CropAndScaleCollage* = object of RectCollage

  CollageError* = object of ValueError




method fillCanvas*(collage: Collage; imageGrid: openArray[seq[Image]]): Image {.base.} =
  raise newException(CollageError, "Don't use an abstract base Collage class")

method fillCanvas*(collage: RectCollage; imageGrid: openArray[seq[Image]]): Image =

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

  let
    resultWidth = pieceWidth * imageGrid[0].len
    resultHeight = pieceHeight * imageGrid.len

  var resultContext = newContext(resultWidth, resultHeight)

  for row, imageRow in imageGrid.pairs:
    for col, image in imageRow.pairs:
      drawImage(resultContext, image, vec2(float32(row * pieceWidth), float32(col * pieceHeight)))

  return resultContext.image




func quickCrop(image: Image; bounds: UVec2): Image =
  let orgBounds = uvec2(uint32(image.width), uint32(image.height))
  let pos = (orgBounds - bounds) div 2'u32
  image.subImage(int(pos[0]), int(pos[1]), int(bounds[0]), int(bounds[1]))

method fillCanvas*(collage: CropCollage; imageGrid: openArray[seq[Image]]): Image =

  var resultBounds = uvec2(high(uint32), high(uint32))

  for row in imageGrid:
    resultBounds[0] = foldl(row, min(a, uint32(b.width)), resultBounds[0])
    resultBounds[1] = foldl(row, min(a, uint32(b.height)), resultBounds[1])



  let croppedImageGrid = collect:
    for row in imageGrid:
      collect:
        for image in row:
          quickCrop(image, resultBounds)

  return procCall fillCanvas(RectCollage(collage), croppedImageGrid)








proc collagify*(collage: Collage; imageGrid: openArray[seq[Image]]): Image =
  if imageGrid.len == 0:
    raise newException(CollageError, "Input must have at least 1 row")

  if anyIt(imageGrid, it.len == 0):
    raise newException(CollageError, "Input cannot have empty rows")

  if imageGrid.len == 1 and imageGrid[0].len == 1:
    raise newException(CollageError, "Input must have at least 2 images")

  return fillCanvas(collage, imageGrid)




proc collagify*(collage: Collage; imageGrid: openArray[seq[string]]; fileFormat: FileFormat = PngFormat): string =
  let decodedImageGrid: seq[seq[Image]] = collect:
    for row in imageGrid:
      collect:
        for image in row:
          let decodedImage = image.decodeImage()
          decodedImage.subImage(decodedImage.opaqueBounds())

  return encodeImage(collage.collagify(decodedImageGrid), fileFormat)
