// module.exports = require("./apis");
const config = require("config");
const { required } = require("@hapi/joi");

const routers = [
  {
    path: "/ping",
    method: "GET",
    handle: (req, res, next) => {
      const version = config.get("app.version");
      const prefixApiVersion = config.get("app.prefixApiVersion");
      return res.json({
        status: "success",
        message: "PONG",
        data: {
          version,
          prefixApiVersion,
        },
      });
    },
  },
  ...require("./apis/products"),
  ...require("./apis/category"),
  ...require("./apis/order"),
];

module.exports = routers;
