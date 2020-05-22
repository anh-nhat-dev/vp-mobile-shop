const mongoose = require("mongoose");
const { CatchAsync } = require("@libs/utils");
const Pagination = require("@libs/pagination");
const { NotFoundException } = require("@exceptions/index");

const Product = mongoose.model("Product");
const Comment = mongoose.model("Comment");

exports.index = CatchAsync(async (req, res) => {
  const { name, isFeatured, ...query } = req.query;
  const conditions = {};
  if (isFeatured) {
    conditions["is_featured"] = true;
  }
  if (name) {
    conditions["name"] = new RegExp(req.query.name, "i");
  }
  const pagination = new Pagination(Product);

  const products = await pagination.paginate(conditions, query);

  res.status(200).json({
    status: "success",
    data: products,
  });
});

exports.show = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.status(200).json({
    status: "success",
    data: product,
  });
});

exports.comments = CatchAsync(async (req, res) => {
  const { id } = req.params;
  const pagination = new Pagination(Comment);
  const conditions = {
    product_id: id,
  };
  const comments = await pagination.paginate(conditions, req.query);

  res.status(200).json({
    status: "success",
    data: comments,
  });
});

exports.storeComments = CatchAsync(async (req, res) => {
  const { id } = req.params;
  await Product.findById(id).then(
    (data) =>
      !data && Promise.reject(new NotFoundException(`Not found product`))
  );
  await new Comment({
    name: req.body.name,
    email: req.body.email,
    content: req.body.content,
    product_id: id,
  }).save();

  res.status(201).json({
    status: "success",
    message: "Create comment successfully",
  });
});
