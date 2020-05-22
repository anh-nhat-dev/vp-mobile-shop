const httpStatus = require("http-status-codes");

class HttpException extends Error {
  constructor(message, statusCode, name, isOperational = true, data) {
    super(message);
    if (typeof isOperational === "object") {
      data = isOperational;
      isOperational = true;
    }
    this.data = data;
    this.status = statusCode >= 500 ? "error" : "fail";
    this.isOperational = isOperational;
    this.statusCode = statusCode;
    this.name = name;

    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestException extends HttpException {
  constructor(message = "Bad Request", data) {
    super(message, httpStatus.BAD_REQUEST, "BadRequestException", data);
  }
}

class NotFoundException extends HttpException {
  constructor(message = "Not Found") {
    super(message, httpStatus.NOT_FOUND, "NotFoundException");
  }
}

class InternalServerError extends HttpException {
  constructor(message = "Internal Server Error") {
    super(
      message,
      httpStatus.INTERNAL_SERVER_ERROR,
      "InternalServerError",
      false
    );
  }
}

class ForbiddenException extends HttpException {
  constructor(message = "Forbidden") {
    super(message, httpStatus.FORBIDDEN, "ForbiddenException");
  }
}

module.exports = {
  HttpException,
  BadRequestException,
  NotFoundException,
  InternalServerError,
  ForbiddenException,
};
