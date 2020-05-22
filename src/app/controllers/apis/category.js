const mongoose = require("mongoose");
const { CatchAsync } = require("@libs/utils");
const Pagination = require("@libs/pagination");

const Category = mongoose.model("Category");
const Product = mongoose.model("Product");

exports.index = CatchAsync(async (req, res) => {
  const pagination = new Pagination(Category);

  const categories = await pagination.paginate({}, req.query);

  res.status(200).json({
    status: "success",
    data: categories,
  });
});

exports.show = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  res.status(200).json({
    status: "success",
    data: category,
  });
});

exports.products = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const pagination = new Pagination(Product);
  const conditions = {
    category_id: id,
  };
  const products = await pagination.paginate(conditions, req.query);

  res.status(200).json({
    status: "success",
    data: products,
  });
});
