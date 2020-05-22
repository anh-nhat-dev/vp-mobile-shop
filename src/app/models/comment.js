var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Comment = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", Comment, "comments");
