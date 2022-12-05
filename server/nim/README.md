# Prerequisites

Install Nim and make sure that it includes `nimble`.

This application was tested using Nim 1.6

# Running

Execute `nimble run server` in root folder.
Sometimes, there may be an error when installing dependencies. This could be
a result of using a Nim version that is too old.

Any subsequent runs after the first execution automatically executes `bin/server`
(unless source code is modified)

The server runs on port 8080. To change it, change it in the source code.

To run a debug version, run `nimble run -d:debug server`

# Testing

Execute `nimble test` in root folder.

# About

This is a http server that receives GET requests containing a matrix of Spotify
image URLS, then will respond with a PNG of the collage. It should be
continuously running.

To send a matrix of URLS, each row of URLs should be separated with `&` and each URL
in each row should be separated with `;`. Do not send a single image as it defeats
the purpose of a collage. The matrix cannot be jagged (uneven rows).

The path should be either `/` or `/crop/`. The former indicates
a strict rectangle collage, so each image's dimensions must be exactly the same.
A crop collage would crop images by using the smallest image's dimensions as a reference
and cropping all images to match those particular dimensions.
