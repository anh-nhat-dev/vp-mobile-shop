const path = require("path");

module.exports = {
  context: path.join(__dirname, "src", "resources", "js"),
  entry: {
    cms: ["./cms/index.js"],
    client: "./client/index.js",
  },
  output: {
    path: path.resolve(__dirname, "src", "public"),
    filename: "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.j(s|sx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [],
};
