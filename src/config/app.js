module.exports = {
  port:
    (process.env.SERVER_PORT && JSON.parse(process.env.SERVER_PORT)) || 3000,
  "enable-webpack-dev-server":
    (process.env.ENABLE_WEBPACK_DEV_SERVER &&
      JSON.parse(process.env.ENABLE_WEBPACK_DEV_SERVER)) ||
    false,
  isUsingPrefixApiVersion: true,
  prefixApiVersion: process.env.PREFIX_API_VERSION || "/v1",
  version: "1.0.0",
  supportValidateMethod: ["post", "put", "patch"],
};
