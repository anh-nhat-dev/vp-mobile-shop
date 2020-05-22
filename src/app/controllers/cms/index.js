module.exports.cms = function (req, res, next) {
  try {
    return res.render("cms");
  } catch (e) {
    next(e);
  }
};
