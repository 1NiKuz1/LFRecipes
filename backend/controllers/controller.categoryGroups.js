const CategoryGroupModel = require("../models/model.categoryGroups.js");
const CategoryModel = require("../models/model.categories.js");
const RecipeCategoryModel = require("../models/model.recipesCategories.js");

class CategoryGroupController {
  async getCategoryGroups(req, res, next) {
    try {
      const categoryGroups = await CategoryGroupModel.getCategoryGroups();
      return res.json(categoryGroups);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  }

  async addCategoryGroup(req, res, next) {
    try {
      await CategoryGroupModel.insertCategoryGroup(req.body);
      return res.send("Группа категорий добалена");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  }

  async updateCategoryGroup(req, res, next) {
    try {
      await CategoryGroupModel.updateCategoryGroup(req.params.id, req.body);
      return res.send("Группа категорий обновлена");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  }

  async deleteCategoryGroup(req, res, next) {
    try {
      const categories = await CategoryModel.getCategoriesByGroupId(
        req.params.id
      );
      if (categories.length) {
        for (let category of categories) {
          await RecipeCategoryModel.deleteRecipeCategoriesByIdCategory(
            category.id
          );
          await CategoryModel.deleteCategory(category.id);
        }
      }
      await CategoryGroupModel.deleteCategoryGroup(req.params.id);
      return res.send("Группа категорий удалена");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "Недопустимый запрос к базе данных", err));
    }
  }
}

module.exports = new CategoryGroupController();
