const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const userModel = require("../models/model.users.js");
const roleModel = require("../models/model.roles.js");
const ApiError = require("../exceptions/api-error");
const { TokenExpiredError } = jwt;
const ROLES = require("../config/roles.config.js");
class AuthJwt {
  verifyToken = (req, res, next) => {
    try {
      const token = req.headers["x-access-token"];

      if (!token) {
        return next(ApiError.Error(403, "Токен не предоставлен!"));
      }

      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          if (err instanceof TokenExpiredError) {
            return next(
              ApiError.Error(
                401,
                "Неавтоизованы! Срок действия Access Token истек!"
              )
            );
          }
          return next(ApiError.Error(401, "Неавтоизованы"));
        }
        req.id_user = decoded.id;
        next();
      });
    } catch (err) {
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  };

  #verifyRole = async (req, res, next) => {
    try {
      const user = await userModel.findUserByExtend("id_user", req.id_user);
      const role = await roleModel.getRole(user.id_role);
      if (role.name !== req.role) {
        return next(ApiError.Error(403, `Только для ${req.role}`));
      }
      next();
    } catch (err) {
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  };

  isAdmin = async (req, res, next) => {
    req.role = ROLES[1]; //admin
    await this.#verifyRole(req, res, next);
  };

  isModerator = async (req, res, next) => {
    req.role = ROLES[2]; //moderator
    await this.#verifyRole(req, res, next);
  };

  isUser = async (req, res, next) => {
    req.role = ROLES[0]; //user
    await this.#verifyRole(req, res, next);
  };

  verifyRecipeChanged = async (req, res, next) => {
    try {
      const user = await userModel.findUserByExtend("id_user", req.id_user);
      const role = await roleModel.getRole(user.id_role);
      if (
        req.id_user != req.params.id_user &&
        role.name !== ROLES[2] &&
        role.name !== ROLES[1]
      ) {
        return next(ApiError.Error(403, `Запрецено для вас`));
      }
      next();
    } catch (error) {
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  };
}

module.exports = new AuthJwt();
