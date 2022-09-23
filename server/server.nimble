# Package

version         = "0.1.0"
author          = "Jason Yip"
description     = "Backend for CS222 project"
license         = "N/A"
srcDir          = "nim-src"
bin             = @["server"]
binDir          = "bin"


# Dependencies

requires "nim >= 1.6.6"


from std/os import walkDirRec, splitFile
from std/strformat import `&`

task test, "Runs tests":
  for path in walkDirRec("nim-tests"):
    let (dir, name, ext) = splitFile(path)
    if ext == ".nim":
      exec &"nim c -r '{path}'"
