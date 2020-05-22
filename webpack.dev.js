const merge = require("webpack-merge");
const common = require("./webpack.common");
const path = require("path");

module.exports = merge(common, {
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "src", "public"),
    port: 3001,
    proxy: {
      context: () => true,
      target: "http://localhost:3000",
    },
    open: true,
    openPage: "http://localhost:3000",
    overlay: true,
    writeToDisk: true,
  },
});
