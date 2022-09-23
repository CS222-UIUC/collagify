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
requires "pixie >= 5.0.0 & < 6.0.0"


from std/os import walkDirRec, splitFile
from std/strformat import `&`

task test, "Runs tests":
  const verbosity = 1
  const nimbleFlags = ""
  for path in walkDirRec("nim-tests"):
    let (dir, name, ext) = splitFile(path)
    if ext == ".nim":
      exec &"nimble {nimbleFlags} c --verbosity:{verbosity} -r '{dir}/{name}'"
