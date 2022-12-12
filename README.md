# Collagify

Ensure Node.js is installed with TypeScript support and Nim is installed with `nimble`. Run `npm install` in both `~/client` and `~/server` to install dependencies for the front-end and API authentication.

# Client (`~/client)`)

Run `npm start dev` for a development server running locally on your machine. To build and run a production application, run `npm start`.

# Running the image generation server (`~/server`)

This application was tested using Nim 1.6

Execute `nimble run server`.
Sometimes, there may be an error when installing dependencies. This could be
a result of using a Nim version that is too old.

Any subsequent runs after the first execution automatically executes `bin/server`
(unless source code is modified)

The server runs on port 8080. To change it, change it in the source code.

To run a debug version, run `nimble run -d:debug server`

## Testing

Execute `nimble test` in root folder.

## About

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

# Running the Spotify authentication examples (`~/api`)

(Excerpts from Spotify's official README)

This project contains basic demos showing the different OAuth 2.0 flows for [authenticating against the Spotify Web API](https://developer.spotify.com/web-api/authorization-guide/).

These examples cover:

* Authorization Code flow
* Client Credentials flow
* Implicit Grant flow

These examples run on Node.js. On [its website](http://www.nodejs.org/download/) you can find instructions on how to install it.

### Using your own credentials
You will need to register your app and get your own credentials from the Spotify for Developers Dashboard.

To do so, go to [your Spotify for Developers Dashboard](https://beta.developer.spotify.com/dashboard) and create your application. For the examples, we registered these Redirect URIs:

* http://localhost:8888 (needed for the implicit grant flow)
* http://localhost:8888/callback

Once you have created your app, replace the `client_id`, `redirect_uri` and `client_secret` in the examples with the ones you get from My Applications.

## Running the examples
In order to run the different examples, open the folder with the name of the flow you want to try out, and run its `app.js` file. For instance, to run the Authorization Code example do:

    $ cd authorization_code
    $ node app.js

Then, open `http://localhost:8888` in a browser.
