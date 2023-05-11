const UserModel = require("../models/model.users.js");
const FavoriteRecipeModel = require("../models/model.favoriteRecipes.js");
const RecipeModel = require("../models/model.recipes.js");
const RecipeCategoryModel = require("../models/model.recipesCategories.js");
const ApiError = require("../exceptions/api-error");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const mailService = require("../service/mail-service.js");
class UserController {
  async all(req, res, next) {
    try {
      return res.status(200).send("Public Content.");
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async user(req, res, next) {
    try {
      return res.status(200).send("User Content.");
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async admin(req, res, next) {
    try {
      return res.status(200).send("Admin Content.");
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async moderator(req, res, next) {
    try {
      return res.status(200).send("Moderator Content.");
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getUsersWithoutAdmins(req, res, next) {
    try {
      const users = await UserModel.getUsersWithoutAdmins();
      return res.json(users);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async addUser(req, res, next) {
    try {
      console.log(req.body);
      const data = {
        login: req.body.login,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        email_token: uuid.v4(),
        created: new Date(),
        id_role: req.body.id_role,
      };
      await UserModel.insertUser(data);
      //await mailService.sendActivationMail(
      //  data.email,
      //  `${process.env.API_URL}/api/activate/${data.email_token}`
      //);
      return res.send("The user has been added");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async updateUser(req, res, next) {
    try {
      await UserModel.updateUser(req.params.id, req.body.data);
      const user = await UserModel.findUserByExtend("id_user", req.params.id);
      return res.json(user);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async deleteUser(req, res, next) {
    try {
      const recipes = await RecipeModel.getAllUserRecipes(req.params.id);
      if (recipes.length) {
        const recipesId = recipes.map((el) => el.id).join(",");
        await RecipeCategoryModel.deleteAllRecipeCategories(recipesId);
        await RecipeModel.deleteUserRecipes(req.params.id);
      }

      await FavoriteRecipeModel.deleteAllUserFavoriteRecipes(req.params.id);
      await UserModel.deleteUser(req.params.id);
      return res.send("The user has been deleted");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async uploadImage(req, res, next) {
    try {
      const dataUrl = req.body.image;
      const imageData = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(imageData, "base64");
      const metadata = await sharp(buffer).metadata();
      if (!metadata.format) {
        return next(ApiError.Error(400, "Invalid image format"));
      }
      await UserModel.updateImageUserById(buffer, req.body.id_user);
      //await userModel.updateUser("img", buffer, "id_user", req.body.id_user);
      return res.status(200).send({ message: "Image saved successfully" });
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getImage(req, res, next) {
    try {
      const result = await UserModel.findUserByExtend("id_user", req.params.id);
      if (!result.img) {
        //return next(ApiError.Error(404, "User's img wasn't found"));
        return res.status(200).send(result.img);
      }
      const metadata = await sharp(result.img).metadata();
      res.set("Content-Type", `image/${metadata.format}`);
      return res.status(200).send(result.img);
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }
}

module.exports = new UserController();
