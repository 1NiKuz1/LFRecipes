const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const userModel = require("../models/model.users.js");
const roleModel = require("../models/model.roles.js");
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
};

verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.id_user = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  userModel
    .findUserByExtend("id_user", req.id_user)
    .then((user) =>
      roleModel
        .getRole(user.id_role)
        .then((role) => {
          if (role.name === "admin") {
            next();
            return;
          }
          res.status(403).send({
            message: "Require Admin Role!",
          });
          return;
        })
        .catch((err) =>
          res.status(500).send({
            message: "invalid database request",
            error: err,
          })
        )
    )
    .catch((err) =>
      res.status(500).send({
        message: "invalid database request",
        error: err,
      })
    );
};

isModerator = (req, res, next) => {
  userModel
    .findUserByExtend("id_user", req.id_user)
    .then((user) =>
      roleModel
        .getRole(user.id_role)
        .then((role) => {
          if (role.name === "moderator") {
            next();
            return;
          }
          res.status(403).send({
            message: "Require Moderator Role!",
          });
          return;
        })
        .catch((err) =>
          res.status(500).send({
            message: "invalid database request",
            error: err,
          })
        )
    )
    .catch((err) =>
      res.status(500).send({
        message: "invalid database request",
        error: err,
      })
    );
};

isUser = (req, res, next) => {
  userModel
    .findUserByExtend("id_user", req.id_user)
    .then((user) =>
      roleModel
        .getRole(user.id_role)
        .then((role) => {
          if (role.name === "user") {
            next();
            return;
          }
          res.status(403).send({
            message: "Require User Role!",
          });
          return;
        })
        .catch((err) =>
          res.status(500).send({
            message: "invalid database request",
            error: err,
          })
        )
    )
    .catch((err) =>
      res.status(500).send({
        message: "invalid database request",
        error: err,
      })
    );
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isUser: isUser,
};
module.exports = authJwt;
