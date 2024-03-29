const CategoryModel = require("../models/model.categories.js");
const RecipeCategoryModel = require("../models/model.recipesCategories.js");

class CategoryController {
  async getCategories(req, res, next) {
    try {
      const categorys = await CategoryModel.getCategories();
      return res.json(categorys);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  }

  async addCategory(req, res, next) {
    try {
      await CategoryModel.insertCategory(req.body);
      return res.send("Категория добавлена");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  }

  async updateCategory(req, res, next) {
    try {
      await CategoryModel.updateCategory(req.params.id, req.body);
      return res.send("Категория обновлена");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  }

  async deleteCategory(req, res, next) {
    try {
      await RecipeCategoryModel.deleteRecipeCategoriesByIdCategory(
        req.params.id
      );
      await CategoryModel.deleteCategory(req.params.id);
      return res.send("Категория удалена");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  }
}

module.exports = new CategoryController();
