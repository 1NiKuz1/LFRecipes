const ROLES = require("../config/roles.config.js");
const ApiError = require("../exceptions/api-error");
const userModel = require("../models/model.users.js");

class VerifySignUp {
  checkDuplicateLoginOrEmail = async (req, res, next) => {
    try {
      let user = await userModel.findUserByExtend("login", req.body.login);
      if (user) {
        return next(ApiError.Error(400, "Логин уже используется"));
      }
      user = await userModel.findUserByExtend("email", req.body.email);
      if (user) {
        return next(ApiError.Error(400, "Email уже используется"));
      }
      next();
    } catch (err) {
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  };

  checkRoleExisted = (req, res, next) => {
    if (!req.body.role) {
      return next(ApiError.Error(400, "Роль не найдена"));
    }
    if (!ROLES.includes(req.body.role)) {
      return next(ApiError.Error(400, "Роль не существует = " + req.body.role));
    }
    next();
  };
}

module.exports = new VerifySignUp();
