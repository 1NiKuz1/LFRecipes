const CategoryModel = require("../models/model.categories.js");
const RecipeCategoryModel = require("../models/model.recipesCategories.js");

class CategoryController {
  async getCategories(req, res, next) {
    try {
      const categorys = await CategoryModel.getCategories();
      return res.send(categorys);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async addCategory(req, res, next) {
    try {
      await CategoryModel.insertCategory(req.body);
      return res.send("The category has been added");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async updateCategory(req, res, next) {
    try {
      await CategoryModel.updateCategory(req.params.id, req.body);
      return res.send("The category has been updated");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async deleteCategory(req, res, next) {
    try {
      await RecipeCategoryModel.deleteRecipeCategoriesByIdCategory(
        req.params.id
      );
      await CategoryModel.deleteCategory(req.params.id);
      return res.send("The category has been deleted");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }
}

module.exports = new CategoryController();
