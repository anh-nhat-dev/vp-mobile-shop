const OrderController = require("@controllers/apis/order");
const routers = [
  {
    path: "/order",
    method: "POST",
    handle: OrderController.order,
    validateBody: "store-order",
  },
];

module.exports = routers;
