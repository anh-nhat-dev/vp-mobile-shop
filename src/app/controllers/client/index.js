const mongoose = require("mongoose");
const Category = mongoose.model("Category");
const Product = mongoose.model("Product");
const fs = require("fs");
const path = require("path");

exports.home = function (req, res, next) {
  return res.render("home1");
};

exports.seed = async function (req, res) {
  // const data = [
  //   "Iphone",
  //   "SamSung",
  //   "HTC",
  //   "Nokia",
  //   "Sony",
  //   "Blackberry",
  //   "OPPO",
  //   "Xiaomi",
  //   "Vivo",
  //   "Huawei",
  // ];

  const categories = await Category.find();
  const bool = Array(true, false);
  for (let i = 0; i < 1000; i++) {
    console.log(i);
    fs.readdirSync(
      path.join(process.cwd(), "src", "public", "uploads", "products")
    ).map(async (file) => {
      const name = file.replace(/-/gi, " ").replace(".png", "");
      const cat = categories.find(
        (item) =>
          item.name.toLocaleLowerCase() ===
          name.toLocaleLowerCase().split(" ")[0]
      );

      await new Product({
        category_id: cat.id,
        name,
        image: path.join("products", file),
        price: Math.ceil(Math.random() * 1000000000),
        accessories: "Hộp, sách, sạc, cáp, tai nghe",
        promotion: "Dán Màn Hình 4D",
        status: "Máy Mới 100%",
        details:
          "Sản phẩm này chúng tôi đang cập nhật nội dung chi tiết, các bạn có thể qua trực tiếp cửa hàng để xem sản phẩm, vì hàng chúng tôi luôn có sẵn.",
        is_stock: bool[Math.floor(Math.random() * bool.length)],
        is_featured: bool[Math.floor(Math.random() * bool.length)],
      }).save();
    });
  }
};
