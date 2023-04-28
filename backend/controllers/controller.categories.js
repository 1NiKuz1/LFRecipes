const categoryModel = require("../models/model.categories.js");

class CategoryController {
  async getCategories(req, res, next) {
    try {
      const categorys = await categoryModel.getCategories();
      return res.status(200).send(categorys);
    } catch (err) {
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }
}

module.exports = new CategoryController();
