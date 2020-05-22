const config = require("config");
const fs = require("fs");
const path = require("path");
const Logger = require("./logger");

const mongoose = require("mongoose");

/**
 *
 */
function _loadModel() {
  const modelPath = config.get("db.mongodb.modelPath");

  if (!fs.existsSync(modelPath))
    return Logger.debug(`The models storage directory does not exist`);

  fs.readdirSync(modelPath)
    .filter((file) => file.indexOf(".") !== 0 && file.slice(-3) === ".js")
    .forEach((file) => require(path.resolve(modelPath, file)));
}

/**
 *
 */
function _connect() {
  const mongodbConfig = config.get("db.mongodb");
  // console.log(mongodbConfig);
  if (!mongodbConfig.uri) return;

  const _mongoConnectError = function (err) {
    Logger.error(`mongoose default connection has occured error`);
  };

  const _mongoConnectSuccess = function () {
    Logger.info(`mongoose default connection is open to ${mongodbConfig.uri}`);
  };

  const _mongodbDisconnected = function () {
    Logger.info(`mongoose default connection is disconnected`);
  };

  mongoose.connect(mongodbConfig.uri, mongodbConfig.options);
  mongoose.connection
    .on("error", _mongoConnectError)
    .on("connected", _mongoConnectSuccess)
    .on("disconnected", _mongodbDisconnected);
}

exports = module.exports = function () {
  _loadModel();
  _connect();
};
