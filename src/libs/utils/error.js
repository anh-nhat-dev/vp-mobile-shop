module.exports.CatchAsync = (fn) => (req, res, next) =>
  fn(req, res, next).catch(next);
