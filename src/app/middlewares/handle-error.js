const Logger = require("@libs/logger");
const httpStatus = require("http-status-codes");
const { HttpException, BadRequestException } = require("@exceptions/index");
const Joi = require("@hapi/joi");

const sendErrorProd = (err, res) => {
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.status === "fail" ? { data: err.data } : {}),
    });
  }

  Logger.error(err);

  return res.status(err.statusCode).json({
    status: "error",
    message: "Interal Server Error",
  });
};

const sendErrorDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status || "error",
    message: err.message,
    ...(err.data ? { data: err.data } : {}),
    error: err,
    stack: err.stack,
  });

const handleCastErrorDB = (err) =>
  new BadRequestException(`Invalid ${err.path}: ${err.value}`);

const handleValidationError = (err) => {
  // console.log(err.all());
  if (err instanceof Joi.ValidationError)
    return new BadRequestException(`Invalid input data.`, err.details);
  const errors = Object.values(err.errors).map((el) => el.message);
  return new BadRequestException(`Invalid input data. ${errors.join(". ")}`);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  return new BadRequestException(
    `Duplicate feild value: ${value}. Please use anothe value!`
  );
};

module.exports = function (err, req, res, next) {
  err.statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  let error = err;
  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.name === "ValidationError") error = handleValidationError(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);

  if (process.env.NODE_ENV === "production") {
    return sendErrorProd(error, res);
  }
  return sendErrorDev(error, res);
};
