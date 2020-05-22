const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const passportJWT = require("passport-jwt");
const url = require("url");
const passport = require("passport");
const acl = require("@libs/acl");
const config = require("config");
const { model } = require("mongoose");

const User = model("User");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const { JWT_SECRET } = config.get("jwt");

function verifyPassword(password, passwordHash) {
  if (!password) {
    return false;
  }

  return bcrypt.compareSync(password, passwordHash);
}

/**
 * Passport local strategy.
 * Authenticate user using login and password
 *
 * @see https://www.npmjs.com/package/passport-local
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, callback) => {
      const errors = {};

      User.findOne({ email })
        .then((user) => {
          if (!user) {
            errors.email = "Invalid e-mail address";
            return callback({
              status: 400,
              errors,
            });
          }

          if (!verifyPassword(password, user.password)) {
            errors.password = "Incorrect password";

            return callback({
              status: 400,
              errors,
            });
          }

          if (user.verifyEmailStatus !== "verified") {
            errors.email = "Email has not been authenticated";

            return callback({
              status: 400,
              errors,
            });
          }
          return callback(null, user, {
            message: "Logged In successfully",
          });
        })
        .catch((err) => callback(err));
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: JWT_SECRET,
    },
    (req, jwtPayload, callback) =>
      User.findOne({
        email: jwtPayload.email,
      })
        .then((user) => {
          const path = url.parse(req.originalUrl).pathname;
          return acl.areAnyRolesAllowed(
            user.role,
            path,
            req.method,
            (err, allowed) => {
              if (!allowed) {
                return callback({
                  message: "Resource not available for your role",
                  errors: `${req.originalUrl} - ${user.role}`.toString(),
                  status: 405,
                });
              }
              return callback(null, user);
            }
          );
        })
        .catch((err) => {
          callback(err);
        })
  )
);
