exports.renderHtml = async (req, viewName, data) => {
  const viewPath = req.app.get("views");
  const html = await ejs.renderFile(
    path.join(viewPath, `${viewName}.ejs`),
    data
  );
  return html;
};

const format = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

exports.formatPrice = (numb) => {
  return format.format(numb);
};

module.exports = {
  ...require("./error"),
};
