const ProductController = require("@controllers/apis/product");
const validateMongoId = require("@middlewares/validate-mongoose-id");
const routers = [
  {
    path: "/products",
    method: "GET",
    handle: ProductController.index,
    group: [
      {
        path: "/:id",
        method: "GET",
        middlewares: [],
        handle: ProductController.show,
        middlewares: [validateMongoId()],
      },
      {
        path: "/:id/comments",
        method: "GET",
        handle: ProductController.comments,
        middlewares: [validateMongoId()],
      },
      {
        path: "/:id/comments",
        method: "POST",
        handle: ProductController.storeComments,
        middlewares: [validateMongoId()],
        validateBody: "add-comments-product",
      },
    ],
  },
];

module.exports = routers;
