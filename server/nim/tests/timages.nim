import std/unittest
from std/os import `/`, parentDir


import server/images


from pixie import Image, PixieError



template info: auto = instantiationInfo(fullPaths = true)
const
  testsDir = info.filename.parentDir()
  imageDir = testsDir / "images"

let
  validImage = readFile(imageDir / "red_pink.png")
  tallImage = readFile(imageDir / "tall.png")
  wideImage = readFile(imageDir / "wide.png")
  invalidImage = readFile(imageDir / "invalid.png")

suite "rectCollage":

  let
    validMatrix = [
                   @[validImage, validImage],
                   @[validImage, validImage],
                  ]

    rectCollage = RectCollage()

  test "just one":
    expect CollageError: discard rectCollage.collagify([@[validImage]])

  test "piece too tall":
    var tallMatrix = deepCopy(validMatrix)
    tallMatrix[0][0] = tallImage
    expect CollageError: discard rectCollage.collagify(tallMatrix)

  test "piece too wide":
    var wideMatrix = deepCopy(validMatrix)
    wideMatrix[0][0] = wideImage
    expect CollageError: discard rectCollage.collagify(wideMatrix)

  test "invalid piece":
    var invalidMatrix = deepCopy(validMatrix)
    invalidMatrix[0][0] = invalidImage
    expect PixieError: discard rectCollage.collagify(invalidMatrix)

  test "not rectangle":
    expect CollageError:
      discard rectCollage.collagify([@[validImage, validImage], @[validImage]])
      discard rectCollage.collagify([
                         @[validImage, validImage],
                         @[validImage, validImage, validImage]
                        ])

  test "valid":
    discard rectCollage.collagify([@[validImage, validImage]])
    discard rectCollage.collagify([@[validImage, validImage], @[validImage, validImage]])


suite "cropCollage":

  let
    cropCollage = CropCollage()


  test "valid":
    discard cropCollage.collagify([@[wideImage, wideImage]])
    discard cropCollage.collagify([@[wideImage, validImage], @[validImage, tallImage]])

