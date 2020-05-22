const pino = require("pino");

function _createInstanceLogger() {
  this.logger = pino({
    level: "debug",
    timestamp: pino.stdTimeFunctions.isoTime,
    prettyPrint: true,
  });
}

function _printLogger(level, message) {
  if (!this.logger) {
    _createInstanceLogger.call(this);
  }
  this.logger[level](message);
}

function Logger() {
  this.logger = null;
}

/**
 *
 */
Logger.prototype.error = function (error) {
  _printLogger.call(this, "error", error);
};

/**
 *
 */
Logger.prototype.debug = function (message) {
  _printLogger.call(this, "debug", message);
};

/**
 *
 */
Logger.prototype.info = function (message) {
  _printLogger.call(this, "info", message);
};

/**
 *
 */
Logger.prototype.warn = function (message) {
  _printLogger.call(this, "warn", message);
};

/**
 *
 */
Logger.prototype.verbose = function (message) {
  _printLogger.call(this, "verbose", message);
};

module.exports = new Logger();
