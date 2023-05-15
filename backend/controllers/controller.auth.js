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
        email_token: uuid.v4(),
        created: new Date(),
        id_role: 1,
      };
      const role = await roleModel.getIdRole(req.body.role);
      data.id_role = role.id_role;
      const user = await userModel.insertUser(data);
      await mailService.sendActivationMail(
        data.email,
        `${process.env.API_URL}/api/activate/${data.email_token}`
      );
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
      const emailToken = req.params.link;
      const user = await userModel.findUserByExtend("email_token", emailToken);
      if (!user) {
        return next(ApiError.Error(404, "Incorect activation link"));
      }
      //await userModel.updateUser("is_activated", 1, "id_user", user.id_user);
      await userModel.updateUser(user.id_user, { is_activated: 1 });
      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const user = await userModel.findUserByExtend("email", req.body.email);
      if (!user) {
        return next(ApiError.Error(401, "Email Not found"));
      }
      const emailToken = uuid.v4();
      //await userModel.updateUser(
      //  "email_token",
      //  emailToken,
      //  "id_user",
      //  user.id_user,
      //);
      await userModel.updateUser(user.id_user, { email_token: emailToken });
      await mailService.sendActivationMail(
        req.body.email,
        `${process.env.API_URL}/api/fogort-password/${emailToken}`
      );
      return res.status(200).json({
        emailToken: emailToken,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async isUserForgotPassword(req, res, next) {
    try {
      const emailToken = req.params.link;
      const user = await userModel.findUserByExtend("email_token", emailToken);
      if (!user) {
        return next(ApiError.Error(404, "Incorect activation link"));
      }
      if (user.is_fogort_password) {
        return res.redirect(process.env.CLIENT_URL + "/change-password");
      }
      //await userModel.updateUser(
      //  "is_fogort_password",
      //  1,
      //  "id_user",
      //  user.id_user
      //);
      await userModel.updateUser(user.id_user, { is_fogort_password: 1 });
      return res.redirect(process.env.CLIENT_URL + "/change-password");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async changeUserPassword(req, res, next) {
    try {
      const user = await userModel.findUserByExtend("email", req.body.email);
      if (!user) {
        return next(ApiError.Error(401, "Email Not found"));
      }
      if (!user.is_fogort_password) {
        return next(ApiError.Error(401, "Email not verified"));
      }
      const password = bcrypt.hashSync(req.body.password, 8);
      //await userModel.updateUser("password", password, "id_user", user.id_user);
      await userModel.updateUser(user.id_user, { password: password });
      //await userModel.updateUser(
      //  "is_fogort_password",
      //  0,
      //  "id_user",
      //  user.id_user
      //);
      await userModel.updateUser(user.id_user, { is_fogort_password: 0 });
      return res.status(200).json({
        message: "password was changed",
      });
      //return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }
}

module.exports = new AuthController();
