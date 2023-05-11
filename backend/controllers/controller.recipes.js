const RecipeModel = require("../models/model.recipes.js");
const FavoriteRecipeModel = require("../models/model.favoriteRecipes.js");
const RecipeCategoryModel = require("../models/model.recipesCategories.js");
const CategoryModel = require("../models/model.categories.js");
const UserModel = require("../models/model.users.js");
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
      // Конвертируем изображение
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

      // Добавляем рецепт
      const recipe = await RecipeModel.insertRecipe(data);

      // Добавляем связь категорий с рецептом
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

  async updateRecipe(req, res, next) {
    try {
      let img;
      if (req.body.img) {
        // Конвертируем изображение
        img = await convertImage(req.body.img);
        if (img instanceof ApiError) {
          return next(img);
        }
      }

      const data = {
        name: req.body.name,
        description: req.body.description,
        video_link: req.body.video_link,
        img: img,
        updated_at: new Date(),
      };

      if (!img) {
        delete data.img;
      }

      // Изменяем рецепт
      const recipe = await RecipeModel.updateRecipe(req.params.id_recipe, data);

      // Удаление категорий рецепта
      await RecipeCategoryModel.deleteRecipeCategories(req.params.id_recipe);

      // Добавляем связь категорий с рецептом
      req.body.categories.forEach(async (categoryId) => {
        await RecipeCategoryModel.insertRecipeCategory({
          id_recipe: req.params.id_recipe,
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

  async deleteRecipe(req, res, next) {
    try {
      const recipe = await RecipeModel.findRecipeByExtend(
        "id",
        req.params.id_recipe
      );
      if (!recipe) {
        return next(ApiError.Error(400, "The recipe is alredy delete"));
      }
      // Удаление рецепта из избранных
      await FavoriteRecipeModel.deleteFavoriteRecipe(req.params.id_recipe);

      // Удаление категорий рецепта
      await RecipeCategoryModel.deleteRecipeCategories(req.params.id_recipe);

      // Удаление рецепта
      await RecipeModel.deleteRecipe(req.params.id_recipe);
      return res.json("The recipe has been removed");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async addFavoriteRecipe(req, res, next) {
    try {
      // Проверка на существования рецепта в связи с пользователем
      (
        await FavoriteRecipeModel.getUserFavoriteRecipes(req.body.id_user)
      ).forEach((recipe) => {
        if (recipe.id_recipe === req.body.id_recipe) {
          return next(ApiError.Error(400, "The recipe is alredy exists"));
        }
      });

      const data = {
        id_user: req.body.id_user,
        id_recipe: req.body.id_recipe,
      };

      // Добавление рецепта
      await FavoriteRecipeModel.addFavoriteRecipe(data);

      return res.send("The recipe has been added");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getFavoriteRecipes(req, res, next) {
    try {
      const userFavoriteRecipes = [];
      (await FavoriteRecipeModel.getUserFavoriteRecipes(req.params.id)).forEach(
        (recipe) => {
          userFavoriteRecipes.push(recipe.id_recipe);
        }
      );

      return res.json(userFavoriteRecipes);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async deleteFavoriteRecipe(req, res, next) {
    try {
      // Проверка на существования рецепта в связи с пользователем
      const userFavoriteRecipes = [];
      (
        await FavoriteRecipeModel.getUserFavoriteRecipes(req.params.id_user)
      ).forEach((recipe) => {
        userFavoriteRecipes.push(recipe.id_recipe);
      });
      if (!userFavoriteRecipes.includes(+req.params.id_recipe)) {
        return next(ApiError.Error(400, "The recipe is alredy delete"));
      }

      // Удаление рецепта
      await FavoriteRecipeModel.deleteUserFavoriteRecipe(
        req.params.id_user,
        req.params.id_recipe
      );
      return res.json("The favorite recipe has been removed");
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getRecipes(req, res, next) {
    try {
      const data = {
        page: req.query.page ? +req.query.page : 1,
        limit: req.query.limit ? +req.query.limit : 30,
        name: req.query.name ?? "",
        sort: req.query.sort ?? "name",
        sortParam: req.query.sortParam ?? "asc",
        filters: req.query.filters ?? "",
      };

      // Получаем рецепты по параметрам из data
      const recipes = await RecipeModel.getRecipes(data);
      // Получаем количество записей по параметрам из data
      const totalRecords = await RecipeModel.getTotalRecords(data);

      res.set("access-control-expose-headers", "X-Total-Count");
      res.set("x-total-count", totalRecords);
      return res.json(recipes);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getUserRecipes(req, res, next) {
    try {
      const data = {
        page: req.query.page ? +req.query.page : 1,
        limit: req.query.limit ? +req.query.limit : 30,
        id_user: req.query.id_user ?? 1,
      };

      // Получаем рецепты по параметрам из data
      const result = await RecipeModel.getUserRecipes(data);
      const recipes = result.recipes;
      const totalRecords = result.totalRecords;

      res.set("access-control-expose-headers", "X-Total-Count");
      res.set("x-total-count", totalRecords);
      return res.json(recipes);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getUserFavoriteRecipes(req, res, next) {
    try {
      const userFavoriteRecipes = [];
      (
        await FavoriteRecipeModel.getUserFavoriteRecipes(req.query.id_user)
      ).forEach((recipe) => {
        userFavoriteRecipes.push(recipe.id_recipe);
      });
      if (!userFavoriteRecipes.length) return res.json(userFavoriteRecipes);
      const data = {
        page: req.query.page ? +req.query.page : 1,
        limit: req.query.limit ? +req.query.limit : 30,
        recipes: userFavoriteRecipes.join(","),
      };

      // Получаем рецепты по параметрам из data
      const result = await RecipeModel.getUserFavoriteRecipes(data);
      const recipes = result.recipes;
      const totalRecords = result.totalRecords;

      res.set("access-control-expose-headers", "X-Total-Count");
      res.set("x-total-count", totalRecords);
      return res.json(recipes);
    } catch (err) {
      if (err instanceof ApiError) {
        return next(err);
      }
      next(ApiError.BadRequest(500, "invalid database request", err));
    }
  }

  async getRecipeById(req, res, next) {
    try {
      // Получаем рецепт по его идентификатору
      const recipe = await RecipeModel.findRecipeByExtend("id", req.params.id);
      delete recipe.img;

      // Получаем категории рецепта
      const categories =
        await RecipeCategoryModel.getRecipeCategoriesByRecipeId(req.params.id);

      // Формируем массив с категориями рецепта
      recipe.categories = [];
      categories.forEach(async (category) => {
        recipe.categories.push(
          (await CategoryModel.getCategoryById(category.id_category))
            .category_name
        );
      });

      // Получаем логин пользователя добавивший рецепт
      const user = await UserModel.findUserByExtend("id_user", recipe.id_user);
      recipe.user_login = user.login;

      return res.json(recipe);
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
