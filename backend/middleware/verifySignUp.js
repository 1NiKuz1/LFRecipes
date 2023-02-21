const ROLES = require("../config/roles.config.js");
//const { findUserByExtend } = require("../models/model.users.js");
const userModel = require("../models/model.users.js");

checkDuplicateLoginOrEmail = (req, res, next) => {
  userModel
    .findUserByExtend("login", req.body.login)
    .then((user) => {
      if (user) {
        res.status(400).send({
          message: "Failed! Login is already in use!",
        });
        return;
      }
      userModel
        .findUserByExtend("email", req.body.email)
        .then((user) => {
          if (user) {
            res.status(400).send({
              message: "Failed! Email is already in use!",
            });
            return;
          }
          next();
        })
        .catch((err) =>
          res.status(500).send({
            message: "invalid database request",
            error: err,
          })
        );
    })
    .catch((err) =>
      res.status(500).send({
        message: "invalid database request",
        error: err,
      })
    );
};

checkRoleExisted = (req, res, next) => {
  if (!req.body.role) {
    res.status(400).send({
      message: "Failed! The role was not found",
    });
    return;
  }
  if (!ROLES.includes(req.body.role)) {
    res.status(400).send({
      message: "Failed! Role does not exist = " + req.body.role,
    });
    return;
  }
  next();
};

const verifySignUp = {
  checkDuplicateLoginOrEmail: checkDuplicateLoginOrEmail,
  checkRoleExisted: checkRoleExisted,
};

module.exports = verifySignUp;
