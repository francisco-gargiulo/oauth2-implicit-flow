var debug = require("debug")("server:server");
var http = require("http");

var app = require("./app");
var port = 3000;

app.set("port", port);

var server = http.createServer(app);

server.listen(port, () => onListening());

function onListening() {
  console.log("server listening on port", port);

  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;

  debug("Listening on " + bind);
}

module.exports = server;
