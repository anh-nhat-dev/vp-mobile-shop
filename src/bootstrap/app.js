const express = require("express");
const path = require("path");
const config = require("config");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const httpLog = require("@middlewares/http-log");
const cors = require("cors");
// const responseFormatter = require("@middlewares/response-formatter");
// App
const app = express();

require("@libs/mongo-db")();

/**
 *
 * App setting
 *
 */

// Static file
app.use("/assets", express.static(path.join(process.cwd(), "src", "public")));

//Template engine
app.set("views", path.join(process.cwd(), "src", "resources", "views"));
app.set("view engine", "ejs");

/**
 *
 * Middleware
 *
 */
app.use(cors({ origin: "*" }));
app.use(httpLog());
app.use(helmet());
app.use("/assets", express.static(path.join(process.cwd(), "src", "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /**
//  *
//  * Webpack dev server
//  *
//  */
// const devWebpackServerEnable = config.get("app.enable-webpack-dev-server");
// if (devWebpackServerEnable) {
//   require("@libs/webpack-dev-server")(app);
// }

// /**
//  *
//  * Library
//  *
//  */
// require("@libs/passport");

/**
 *
 * Register routes
 *
 */
require("@libs/router-register")(app);

// Not match router
app.all("*", require("@middlewares/not-match-router"));
// Error handel
app.use(require("@middlewares/handle-error"));
module.exports = app;
