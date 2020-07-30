const mongoose = require("mongoose");
const { CatchAsync, renderHtml, formatPrice } = require("@libs/utils");
const _ = require("lodash");
const transporter = require("@libs/mail");

const OrderModel = mongoose.model("Order");
const ProductModel = mongoose.model("Product");

exports.order = CatchAsync(async (req, res) => {
  const body = req.body;

  const idsPrd = body.items.map((item) => item.prd_id);

  const products = await ProductModel.find({ _id: { $in: idsPrd } }).lean();

  const order = {
    fullName: body.name,
    address: body.address,
    email: body.email,
    phone: body.phone,
  };

  const items = [];
  let totalPrice = 0;

  for (let item of body.items) {
    const prd = _.find(products, { _id: item.prd_id });
    if (prd) {
      item.price = prd.price;
      totalPrice += item.qty * prd.price;
      items.push(item);
    }
  }

  order.totalPrice = totalPrice;
  order.items = items;

  await new OrderModel(order).save();

  const html = await renderHtml(req, "email", {
    products,
    cart: body.items,
    name: body.name,
    phone: body.phone,
    email: body.email,
    address: body.address,
    date: moment().format(),
    totalPrice: formatPrice(totalPrice),
    formatPrice,
  });

  await transporter.sendMail({
    from: '"Vietpro Shop" <mail@gmail.com>',
    to: email,
    subject: "Thong tin don hang",
    html: html,
  });

  res.status(201).json({
    status: "success",
    message: "Create order succesfully",
  });
});
