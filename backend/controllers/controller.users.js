const userModel = require("../models/model.users.js");
const ApiError = require("../exceptions/api-error");
const sharp = require("sharp");
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

  async uploadImage(req, res, next) {
    try {
      const dataUrl = req.body.image;
      const imageData = dataUrl.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(imageData, "base64");
      const metadata = await sharp(buffer).metadata();
      if (!metadata.format) {
        return next(ApiError.Error(400, "Invalid image format"));
      }
      await userModel.updateImageUserById(buffer, req.body.id_user);
      //await userModel.updateUser("img", buffer, "id_user", req.body.id_user);
      return res.status(200).send({ message: "Image saved successfully" });
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getImage(req, res, next) {
    try {
      const result = await userModel.findUserByExtend("id_user", req.params.id);
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
