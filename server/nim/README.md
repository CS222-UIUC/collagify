# Prerequisites

Install Nim and make sure that it includes `nimble`

# Running

Execute `nimble run server` in root folder

# Testing

Execute `nimble test` 

# About

This is a http server that receives GET requests containing a matrix of Spotify
image URLS, then will respond with a PNG of the collage.

To send a matrix of URLS, each row of URLs should be separated with `&` and each URL
in each row should be separated with `;`. Do not send a single image as it defeats
the purpose of a collage.
