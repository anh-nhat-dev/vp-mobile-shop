const ClientController = require("@app/controllers/client");

const routers = [
  {
    path: "/seed-data",
    method: "GET",
    handle: ClientController.seed,
  },
];

module.exports = routers;
