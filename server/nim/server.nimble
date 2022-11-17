# Package

version         = "0.1.0"
author          = "Jason Yip"
description     = "Backend for CS222 project"
license         = "N/A"
srcDir          = "src"
bin             = @["server"]
binDir          = "bin"


# Dependencies

requires "nim >= 1.6"
requires "pixie >= 5 & < 6"
requires "vmath >= 1.2 & < 1.3"
