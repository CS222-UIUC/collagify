from std/sequtils import allIt, mapIt
from std/sugar import collect


import pixie
import pixie/fileformats/[png]
import vmath



proc strictCollage*(imageGrid: openArray[seq[string]]): string =

  if imageGrid.len <= 1:
    raise newException(ValueError, "Input must have at least 2 rows")

  if not allIt(imageGrid, it.len == imageGrid.len):
    raise newException(ValueError, "Input must be a square matrix of images")

  let decodedImages: seq[seq[Image]] = collect:
    for row in imageGrid:
      mapIt(row, it.decodeImage())

  let
    pieceWidth = decodedImages[0][0].width
    pieceHeight = decodedImages[0][0].height

  for row in decodedImages:
    for image in row:
      if not (image.width == pieceWidth and image.height == pieceHeight):
        raise newException(ValueError, "All images must be the same size")

  let
    resultWidth = pieceWidth * decodedImages[0].len
    resultHeight = pieceHeight * decodedImages.len

  var resultContext = newContext(resultWidth, resultHeight)

  for row, imageRow in decodedImages.pairs:
    for col, image in imageRow.pairs:
      drawImage(resultContext, image, vec2(float32(row * pieceWidth), float32(col * pieceHeight)))


  return encodePng(resultContext.image)
