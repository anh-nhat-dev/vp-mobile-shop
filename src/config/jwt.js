module.exports = {
  EXPIRE_TIME_TOKEN: process.env.EXPIRE_TIME_TOKEN || 600000,
  JWT_SECRET: process.env.JWT_SECRET || "secrec",
  EMAIL_SECRET: process.env.EMAIL_SECRET,
};
