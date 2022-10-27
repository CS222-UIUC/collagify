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

suite "strictCollage":

  let
    validMatrix = [
                   @[validImage, validImage],
                   @[validImage, validImage],
                  ]

    strictCollage = StrictCollage()

  test "just one":
    expect CollageError: discard strictCollage.collagify([@[validImage]])

  test "piece too tall":
    var tallMatrix = deepCopy(validMatrix)
    tallMatrix[0][0] = tallImage
    expect CollageError: discard strictCollage.collagify(tallMatrix)

  test "piece too wide":
    var wideMatrix = deepCopy(validMatrix)
    wideMatrix[0][0] = wideImage
    expect CollageError: discard strictCollage.collagify(wideMatrix)

  test "invalid piece":
    var invalidMatrix = deepCopy(validMatrix)
    invalidMatrix[0][0] = invalidImage
    expect PixieError: discard strictCollage.collagify(invalidMatrix)

  test "not rectangle":
    expect CollageError:
      discard strictCollage.collagify([@[validImage, validImage], @[validImage]])
      discard strictCollage.collagify([
                         @[validImage, validImage],
                         @[validImage, validImage, validImage]
                        ])

  test "valid":
    discard strictCollage.collagify([@[validImage, validImage]])
    discard strictCollage.collagify([@[validImage, validImage], @[validImage, validImage]])


suite "cropCollage":

  let
    validMatrix = [
                   @[validImage, validImage],
                   @[validImage, validImage],
                  ]

    cropCollage = CropCollage()


  test "valid":
    discard cropCollage.collagify([@[wideImage, wideImage]])
    discard cropCollage.collagify([@[validImage, validImage], @[validImage, tallImage]])

