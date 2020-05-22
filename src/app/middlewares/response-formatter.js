const { get } = require("lodash");
const { model } = require("mongoose");
const User = model("User");

const responseFormatter = (req, res, next) => {
  let statusCode = 200;
  const { response } = req;

  if (typeof response === "object") {
    if (get(response, "data.password")) {
      delete response.data.password;
    }

    if (get(response, "data.dataURL")) {
      delete response.data.dataURL;
      delete response.data.tempSecret;
      delete response.data.otpURL;
      delete response.data.tempToken;
    }

    if (get(response, "data.User")) {
      const user = get(response, "data.User");

      if (user instanceof User) {
        Object.assign(response.data, { user: user.get() });
      }
    }

    if (get(response, "data.User.password")) {
      delete response.data.User.password;
      delete response.data.User.hash;
      delete response.data.User.likes;
    }

    Object.assign(response, { error: null });

    if (req.statusCode) {
      statusCode = get(req, "statusCode");
      delete req.statusCode;
    }

    return res.status(statusCode).json(response);
  }

  return next(req);
};

module.exports = responseFormatter;
