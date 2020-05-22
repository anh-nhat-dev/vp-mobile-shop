const acl = require("acl");
const _ = require("lodash");
const aclConfig = require("config").get("aclConfig");

const aclInstance = new acl(new acl.memoryBackend());

aclInstance.allow(aclConfig);

module.exports = aclInstance;
module.exports.getAclRouter = function (req, res, next) {
  aclInstance.whatResources(_.get(req, "user.role"), (err, data) => {
    req.response = { data };
    return next();
  });
};
