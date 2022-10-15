import std/unittest
from std/os import `/`, parentDir


import server/images


from pixie import PixieError



template info: auto = instantiationInfo(fullPaths = true)
const
  testsDir = info.fileName.parentDir()
  imageDir = testsDir / "images"


suite "strictCollage":

  test "non square":
    expect ValueError:
      discard strictCollage([])
      discard strictCollage([@["a"]])
      discard strictCollage([@["a", "b"]])
      discard strictCollage([@["a", "b"], @["a"]])
      discard strictCollage([@["a", "b"], @["a", "b", "c"]])

  let
    validImage = readFile(imageDir / "red_pink.png")
    tallImage = readFile(imageDir / "tall.png")
    wideImage = readFile(imageDir / "wide.png")
    invalidImage = readFile(imageDir / "invalid.png")

    validMatrix = [
                   @[validImage, validImage],
                   @[validImage, validImage],
                  ]

  test "piece too tall":
    var tallMatrix = deepCopy(validMatrix)
    tallMatrix[0][0] = tallImage
    expect ValueError: discard strictCollage(tallMatrix)

  test "piece too wide":
    var wideMatrix = deepCopy(validMatrix)
    wideMatrix[0][0] = wideImage
    expect ValueError: discard strictCollage(wideMatrix)

  test "invalid piece":
    var invalidMatrix = deepCopy(validMatrix)
    invalidMatrix[0][0] = invalidImage
    expect PixieError: discard strictCollage(invalidMatrix)
