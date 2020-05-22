const { NotFoundException } = require("@exceptions/index");

module.exports = function (req, res, next) {
  next(
    new NotFoundException(`Can't not find ${req.originalUrl} on this server!`)
  );
};
