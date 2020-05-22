const mongoose = require("mongoose");
const { BadRequestException } = require("@exceptions/index");

module.exports = function (param = "id") {
  return function (req, res, next) {
    const id = req.params[param];
    if (mongoose.Types.ObjectId.isValid(id)) {
      return next();
    }
    throw new BadRequestException(`Invalid params '${param}'`);
  };
};
