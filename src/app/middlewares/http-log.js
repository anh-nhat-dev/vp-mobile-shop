const Logger = require("@libs/logger");
const chalk = require("chalk");

function codeToColor(code) {
  if (code >= 500) return chalk.red(code);
  if (code >= 400) return chalk.yellow(code);
  if (code >= 300) return chalk.cyan(code);
  if (code >= 200) return chalk.green(code);
  return code;
}

module.exports = function () {
  let start;

  function onResFinished() {
    this.removeListener("error", onResFinished);
    this.removeListener("finish", onResFinished);

    const delta = Math.ceil(Date.now() - start);
    Logger.debug(
      `${this.req.method} ${this.req.originalUrl} ${delta}ms ${codeToColor(
        this.statusCode
      )}`
    );
  }

  return function (req, res, next) {
    start = Date.now();
    res.on("finish", onResFinished);
    res.on("error", onResFinished);
    next();
  };
};
