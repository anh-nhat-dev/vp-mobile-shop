const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const open = require("open");
const webpackConfig = require("@root/webpack.dev");
const config = require("config");

module.exports = function (app) {
  webpackConfig.entry.cms.unshift(
    "webpack-hot-middleware/client?reload=true&timeout=1000"
  );
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());

  const compile = webpack(webpackConfig);

  app.use(
    webpackDevMiddleware(compile, {
      writeToDisk: true,
    })
  );
  app.use(webpackHotMiddleware(compile));
  (async () => {
    await open("http://localhost:3000");
  })();
};
