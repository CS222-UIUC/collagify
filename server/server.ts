/* Load the HTTP library */
let http = require("http");

/* Create an HTTP server to handle responses */

http
  .createServer(function (request: any, response: any) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello Waaaofrld");
    response.end();
  })
  .listen(8888);
