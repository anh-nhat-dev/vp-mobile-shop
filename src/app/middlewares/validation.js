const config = require("config");
const _ = require("lodash");
const Joi = require("@hapi/joi");
const schemas = require("../schemas");
const { CatchAsync } = require("@libs/utils");
const Logger = require("@libs/logger");

module.exports = function (key) {
  const supportValidateMethod = config.get("app.supportValidateMethod");
  const itemObj = _.find(schemas, { key });

  return CatchAsync(async (req, res, next) => {
    const method = req.method.toLowerCase();
    let schema;

    if (itemObj && _.includes(supportValidateMethod, method)) {
      schema = itemObj.schema;
    }

    if (!schema) {
      Logger.debug(`Not found schema or method not support`);
    }

    if (schema) {
      const value = await schema.validateAsync(req.body, { abortEarly: false });
      req.body = value;
    }

    next();
  });
};
