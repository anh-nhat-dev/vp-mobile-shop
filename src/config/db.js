const path = require("path");

module.exports = {
  mongodb: {
    uri: process.env.DB_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    modelPath: path.resolve(process.cwd(), "src", "app", "models"),
  },
};
