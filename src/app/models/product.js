const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    category_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    price: {
      type: String,
    },
    status: {
      type: String,
    },
    accessories: {
      type: String,
    },
    promotion: {
      type: String,
    },
    details: {
      type: String,
    },
    is_stock: {
      type: Boolean,
    },
    is_featured: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema, "products");
