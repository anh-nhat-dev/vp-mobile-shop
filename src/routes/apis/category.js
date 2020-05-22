const CategoryController = require("@controllers/apis/category");
const validateMongoId = require("@middlewares/validate-mongoose-id");

const routers = [
  {
    path: "/categories",
    method: "GET",
    handle: CategoryController.index,
    group: [
      {
        path: "/:id",
        method: "GET",
        middlewares: [],
        handle: CategoryController.show,
        middlewares: [validateMongoId()],
      },
      {
        path: "/:id/products",
        method: "GET",
        handle: CategoryController.products,
        middlewares: [validateMongoId()],
      },
    ],
  },
];

module.exports = routers;
