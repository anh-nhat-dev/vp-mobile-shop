const mongoose = require("mongoose");
const moment = require("moment");
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

  for (let prd of products) {
    const cart = _.find(body.items, {
      prd_id: prd._id.toString(),
    });

    if (cart) {
      cart.price = prd.price;
      totalPrice += cart.qty * prd.price;
      items.push(cart);
    }
  }

  order.totalPrice = totalPrice;
  order.items = items;

  await new OrderModel(order).save();

  const html = await renderHtml(req, "mail", {
    products: products,
    cart: body.items,
    name: body.name,
    phone: body.phone,
    email: body.email,
    address: body.address,
    date: moment().format(),
    totalPrice: formatPrice(totalPrice),
    formatPrice,
  });

  transporter.sendMail({
    from: '"Vietpro Shop" <mail@gmail.com>',
    to: body.email,
    subject: "Thong tin don hang",
    html: html,
  });

  return res.status(201).json({
    status: "success",
    message: "Create order succesfully",
  });
});
