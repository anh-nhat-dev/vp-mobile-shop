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
  {
    key: "store-order",
    schema: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email(),
      phone: Joi.number().required(),
      address: Joi.string().required(),
      items: Joi.array().items(
        Joi.object({
          prd_id: Joi.string().required(),
          qty: Joi.number().required(),
        })
      ),
    }),
  },
];
