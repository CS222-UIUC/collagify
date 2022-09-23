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


task test, "Runs tests":
  exec "nim c -r nim-tests/t*"
