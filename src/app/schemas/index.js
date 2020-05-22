const Joi = require("@hapi/joi");

module.exports = [
  {
    key: "test",
    schema: Joi.object({
      test: Joi.string().required(),
      two: Joi.string().required(),
    }),
  },
  {
    key: "add-comments-product",
    schema: Joi.object({
      email: Joi.string().email(),
      content: Joi.string().min(15).required(),
      name: Joi.string().min(3).required(),
    }),
  },
];
