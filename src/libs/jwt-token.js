const jwt = require("jsonwebtoken");
const { EMAIL_SECRET, EXPIRE_TIME_TOKEN, JWT_SECRET } = require("config").get(
  "jwt"
);

function verifyEmailToken(token, ignoreExpiration) {
  try {
    return jwt.verify(token, EMAIL_SECRET, {
      ignoreExpiration: !!ignoreExpiration,
    });
  } catch (err) {
    return false;
  }
}

function emailToken(payload, expirationTime) {
  return jwt.sign(payload, EMAIL_SECRET, { expiresIn: expirationTime || "2d" });
}

const signInToken = ({ email, _id, fullName, phone, role, code }) => {
  const expiresIn = Date.now() + EXPIRE_TIME_TOKEN;
  const payload = {
    email,
    _id,
    // phone,
    role,
    fullName,
    code,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

module.exports = {
  verifyEmailToken,
  emailToken,
  signInToken,
};
