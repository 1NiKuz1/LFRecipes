const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const mailService = require("../service/mail-service.js");
const userModel = require("../models/model.users.js");
const roleModel = require("../models/model.roles.js");
const refreshTokenModel = require("../models/model.refreshToken.js");
const ApiError = require("../exceptions/api-error");

class AuthController {
  async signup(req, res, next) {
    try {
      const data = {
        login: req.body.login,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        activation_link: uuid.v4(),
        created: new Date(),
        id_role: 1,
      };
      const role = await roleModel.getIdRole(req.body.role);
      data.id_role = role.id_role;
      const user = await userModel.insertUser(data);
      //await mailService.sendActivationMail(
      //  data.email,
      //  `${process.env.API_URL}/api/activate/${data.activation_link}`
      //);
      return res.json(user);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async signin(req, res, next) {
    try {
      const user = await userModel.findUserByExtend("email", req.body.email);
      if (!user) {
        return next(ApiError.Error(401, "Email Not found"));
      }
      if (!user.is_activated) {
        return next(ApiError.Error(401, "Email not confirmed"));
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return next(ApiError.Error(401, "Invalid Password"));
      }

      const token = jwt.sign({ id: user.id_user }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await refreshTokenModel.findTokenByExtend(
        "id_user",
        user.id_user
      );

      if (refreshToken != null) {
        await refreshTokenModel.destroyTokenByExtend(
          "id_token",
          refreshToken.id_token
        );
      }

      await refreshTokenModel.insertToken(user);

      refreshToken = await refreshTokenModel.findTokenByExtend(
        "id_user",
        user.id_user
      );

      const role = await roleModel.getRole(user.id_role);

      return res.status(200).send({
        id: user.id_user,
        username: user.login,
        email: user.email,
        role: role.name,
        accessToken: token,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async refreshToken(req, res, next) {
    const { refreshToken: requestToken } = req.body;

    if (requestToken == null) {
      return next(ApiError.Error(403, "Refresh Token is required"));
    }

    try {
      let refreshToken = await refreshTokenModel.findTokenByExtend(
        "token",
        requestToken
      );

      console.log(refreshToken);

      if (!refreshToken) {
        return next(ApiError.Error(403, "Refresh token is not in database!"));
      }

      if (refreshTokenModel.verifyExpiration(refreshToken)) {
        await refreshTokenModel.destroyTokenByExtend("token", refreshToken);
        return next(
          ApiError.Error(
            403,
            "Refresh token was expired. Please make a new signin request"
          )
        );
      }

      const user = await userModel.findUserByExtend(
        "id_user",
        refreshToken.id_user
      );
      let newAccessToken = jwt.sign({ id: user.id_user }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      return res.status(200).json({
        accessToken: newAccessToken,
        refreshToken: refreshToken.token,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      const user = await userModel.findUserByExtend(
        "activation_link",
        activationLink
      );
      if (!user) {
        return next(ApiError.Error(404, "Incorect activation link"));
      }
      await userModel.updateActivateUserByExtend("id_user", user.id_user);
      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }
}

module.exports = new AuthController();
