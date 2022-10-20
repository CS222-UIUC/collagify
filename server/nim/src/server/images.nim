from std/macros import unpackVarArgs
from std/sequtils import anyIt, allIt, mapIt, foldl
from std/sugar import collect
from std/strformat import `&`


import pixie
import pixie/fileformats/[png]
import vmath



type
  Collage* {.inheritable.} = object
  StrictCollage* = object of Collage
  TransformativeCollage* {.inheritable.} = object of Collage
  CropCollage* = object of TransformativeCollage
  ScaledCollage* = object of TransformativeCollage
  CropAndScaleCollage* = object of TransformativeCollage

  CollageError* = object of ValueError




method fillCanvas*(collage: Collage; imageGrid: openArray[seq[Image]]): Image {.base.} =
  raise newException(CollageError, "Don't use base collage class")

method fillCanvas*(collage: StrictCollage; imageGrid: openArray[seq[Image]]): Image =

  if not allIt(imageGrid, it.len == imageGrid.len):
    raise newException(CollageError, "Input must be a square matrix of images")

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





#[
method fillCanvas*(collage: CropCollage; imageGrid: openArray[seq[Image]]): Image =

  var
    resultWidth = sum()
    resultHeight = high(uint)

  for row in imageGrid:
    resultWidth = foldl(row, min(a, b.width), resultWidth)
    resultHeight = foldl(row, min(a, b.height), resultHeight)

  var resultContext = newContext(resultWidth, resultHeight)

  for row, imageRow in imageGrid.pairs:
    for col, image in imageRow.pairs:
      drawImage(resultContext, image, vec2(float32(row * pieceWidth), float32(col * pieceHeight)))

  return resultContext.image
]#







proc collagify*(collage: Collage; imageGrid: openArray[seq[Image]]): Image =
  if imageGrid.len == 0:
    raise newException(CollageError, "Input must have at least 1 row")

  if anyIt(imageGrid, it.len == 0):
    raise newException(CollageError, "Input cannot have empty rows")

  if imageGrid.len == 1 and imageGrid[0].len == 1:
    raise newException(CollageError, "Input must have at least 2 images")

  return fillCanvas(collage, imageGrid)




proc collagify*(collage: Collage; imageGrid: openArray[seq[string]]): string =
  let decodedImageGrid: seq[seq[Image]] = collect:
    for row in imageGrid:
      mapIt(row, it.decodeImage())

  return encodePng(collage.collagify(decodedImageGrid))
