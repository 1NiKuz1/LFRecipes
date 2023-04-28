const RecipeModel = require("../models/model.recipes.js");
const RecipeCategoryModel = require("../models/model.recipesCategories.js");
const ApiError = require("../exceptions/api-error");
const sharp = require("sharp");

async function convertImage(image) {
  try {
    const dataUrl = image;
    const imageData = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(imageData, "base64");
    const metadata = await sharp(buffer).metadata();
    if (!metadata.format) {
      return ApiError.Error(400, "Invalid image format");
    }
    return buffer;
  } catch (err) {
    return ApiError.BadRequest(500, "invalid image request", err);
  }
}

class RecipeController {
  async addRecipe(req, res, next) {
    try {
      console.log(this);
      const img = await convertImage(req.body.img);
      if (img instanceof ApiError) {
        return next(img);
      }
      const data = {
        name: req.body.name,
        description: req.body.description,
        video_link: req.body.video_link,
        img: img,
        id_user: req.body.id_user,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const recipe = await RecipeModel.insertRecipe(data);
      req.body.categories.forEach(async (categoryId) => {
        await RecipeCategoryModel.insertRecipeCategory({
          id_recipe: recipe.insertId,
          id_category: categoryId,
        });
      });
      return res.json(recipe);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getRecipes(req, res, next) {
    try {
      const recipes = await RecipeModel.getRecipes();
      return res.json(recipes);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getRecipeCategories(req, res, next) {
    try {
      const recipeCategories = await RecipeCategoryModel.getRecipeCategories();
      return res.json(recipeCategories);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getImage(req, res, next) {
    try {
      const result = await RecipeModel.findRecipeByExtend("id", req.params.id);
      if (!result.img) {
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

module.exports = new RecipeController();
