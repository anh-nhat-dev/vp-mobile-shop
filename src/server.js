#! /bin/node
const http = require("http");
const app = require("@bootstrap/app");
const config = require("config");
const Logger = require("@libs/logger");

const port = config.get("app.port");

const server = http.createServer(app);

server.listen(port, () => {
  Logger.debug(`Server listening on port: ${port}`);
});
