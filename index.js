var http = require("http");

var app = require("./src");
var port = 3001;

app.set("port", port);

var server = http.createServer(app);

server.listen(port, () => onListening());

function onListening() {
  console.log("server listening on port", port);
}

module.exports = server;
