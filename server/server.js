/* Load the HTTP library */
var http = require("http");

/* Create an HTTP server to handle responses */

http
  .createServer(function (_, response) {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("Hello Worasdadsld");
    response.end();
  })
  .listen(8888);
