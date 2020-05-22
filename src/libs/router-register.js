const { Router } = require("express");
const config = require("config");
const _ = require("lodash");
const Logger = require("./logger");
const validation = require("@middlewares/validation");

/**
 *
 *
 * @param {*} path
 * @returns
 */
function mergerPath(...path) {
  if (!path.length) return "/";
  path = path.reduce((a, c) => {
    if (!c) return a;
    c = c.replace(/^\//, "").replace(/\/$/, "");
    return `${a}/${c}`;
  }, "");

  return path;
}

/**
 *
 *
 * @param {*} item
 * @returns
 */
function formatData(item) {
  const isGroupRouter = item.group && item.group.length && true;
  const method = item.method.toLowerCase();
  const middlewares = item.middlewares || [];
  const path = mergerPath(item.path);
  return { isGroupRouter, method, middlewares, path };
}

/**
 *
 *
 * @param {*} item
 * @param {*} router
 * @param {*} path
 */
function groupRouter(item, router, path) {
  console.log("groupRouter -> path", path);
  const listRemove = ["group", "groupMiddlewares"];
  const _item = _.cloneDeep(item);

  Object.keys(_item).filter(
    (key) => listRemove.includes(key) && delete _item[key]
  );

  _item.path = "";
  item.group.unshift(_item);
  router.use(path, ...(item.groupMiddlewares || []), bindRouter(item.group));
}

/**
 *
 *
 * @param {*} item
 * @param {*} router
 */
function mapItemToRouter(item, router) {
  const { isGroupRouter, method, middlewares, path } = formatData(item);

  if (item.validateBody && _.isString(item.validateBody)) {
    middlewares.unshift(validation(item.validateBody));
  }

  if (isGroupRouter) {
    groupRouter(item, router, path);
  }
  if (!isGroupRouter) {
    router[method](path, ...middlewares, item.handle);
  }
}

/**
 *
 *
 * @param {*} routers
 * @returns
 */
function bindRouter(routers) {
  try {
    const router = Router();
    if (!routers || !Array.isArray(routers))
      throw new Error("routers must be an array");
    for (let item of routers) {
      mapItemToRouter(item, router);
    }
    return router;
  } catch (e) {
    Logger.error(e);
  }
}

module.exports = function (app) {
  const isUsingPrefixApiVersion = config.get("app.isUsingPrefixApiVersion");
  const prefixApiVersion = config.get("app.prefixApiVersion");
  app.use(
    `/api${isUsingPrefixApiVersion ? prefixApiVersion : ""}`,
    bindRouter(require("@routes/api"))
  );
  app.use("/", bindRouter(require("@routes/web")));
};
