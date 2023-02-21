const ROLES = require("../config/roles.config.js");
const ApiError = require("../exceptions/api-error");
const userModel = require("../models/model.users.js");

class VerifySignUp {
  checkDuplicateLoginOrEmail = async (req, res, next) => {
    try {
      let user = await userModel.findUserByExtend("login", req.body.login);
      if (user) {
        return next(ApiError.Error(400, "Failed! Login is already in use!"));
      }
      user = await userModel.findUserByExtend("email", req.body.email);
      if (user) {
        return next(ApiError.Error(400, "Failed! Email is already in use!"));
      }
      next();
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  };

  checkRoleExisted = (req, res, next) => {
    if (!req.body.role) {
      return next(ApiError.Error(400, "Failed! The role was not found"));
    }
    if (!ROLES.includes(req.body.role)) {
      return next(
        ApiError.Error(400, "Failed! Role does not exist = " + req.body.role)
      );
    }
    next();
  };
}

module.exports = new VerifySignUp();
