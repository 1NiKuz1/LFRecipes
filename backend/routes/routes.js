const express = require("express");
const router = express.Router();
const authJwt = require("../middleware/authJwt.js");
const verifySignUp = require("../middleware/verifySignUp.js");
const authController = require("../controllers/controller.auth.js");
const userController = require("../controllers/controller.users.js");
const categoryController = require("../controllers/controller.categories.js");
const categoryGroupController = require("../controllers/controller.categoryGroups.js");
const recipeController = require("../controllers/controller.recipes.js");

// Auth controllers

router.post(
  "/api/auth/signup",
  [verifySignUp.checkDuplicateLoginOrEmail, verifySignUp.checkRoleExisted],
  authController.signup
);

router.post("/api/auth/signin", authController.signin);

router.get("/api/activate/:link", authController.activate);

router.post("/api/auth/refreshtoken", authController.refreshToken);

router.post("/api/fogort-password", authController.forgotPassword);

router.get("/api/fogort-password/:link", authController.isUserForgotPassword);

router.patch("/api/change-password", authController.changeUserPassword);

// User controllers

router.get(
  "/api/users/without-admins",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.getUsersWithoutAdmins
);

router.post(
  "/api/user/upload-image",
  [authJwt.verifyToken],
  userController.uploadImage
);
router.get("/api/user/get-image/:id", userController.getImage);
router.patch(
  "/api/user/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.updateUser
);
router.delete(
  "/api/user/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.deleteUser
);
router.put(
  "/api/user/",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.addUser
);

// Categorys controllers

router.get("/api/categories", categoryController.getCategories);
router.put(
  "/api/categories",
  [authJwt.verifyToken, authJwt.isAdmin],
  categoryController.addCategory
);
router.patch(
  "/api/categories/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  categoryController.updateCategory
);
router.delete(
  "/api/categories/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  categoryController.deleteCategory
);

// CategoryGroups controllers

router.get("/api/category-groups", categoryGroupController.getCategoryGroups);
router.put(
  "/api/category-groups",
  [authJwt.verifyToken, authJwt.isAdmin],
  categoryGroupController.addCategoryGroup
);
router.patch(
  "/api/category-groups/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  categoryGroupController.updateCategoryGroup
);
router.delete(
  "/api/category-groups/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  categoryGroupController.deleteCategoryGroup
);

// Recipes controllers

router.post("/api/recipes", [authJwt.verifyToken], recipeController.addRecipe);
router.get("/api/recipes", recipeController.getRecipes);
router.get(
  "/api/recipes/user-recipes",
  [authJwt.verifyToken],
  recipeController.getUserRecipes
);
router.get(
  "/api/recipes/user-favorite-recipes",
  [authJwt.verifyToken],
  recipeController.getUserFavoriteRecipes
);
router.get("/api/recipes/categories", recipeController.getRecipeCategories);
router.get("/api/recipes/get-image/:id", recipeController.getImage);

router.get("/api/recipe/:id", recipeController.getRecipeById);
router.delete(
  "/api/recipe/:id_recipe/:id_user",
  [authJwt.verifyToken, authJwt.verifyRecipeChanged],
  recipeController.deleteRecipe
);
router.patch(
  "/api/recipe/:id_recipe/:id_user",
  [authJwt.verifyToken, authJwt.verifyRecipeChanged],
  recipeController.updateRecipe
);

router.post(
  "/api/recipes/favorite-recipe/",
  [authJwt.verifyToken],
  recipeController.addFavoriteRecipe
);
router.get(
  "/api/recipes/favorite-recipe/:id",
  [authJwt.verifyToken],
  recipeController.getFavoriteRecipes
);
router.delete(
  "/api/recipes/favorite-recipe/:id_user/:id_recipe",
  [authJwt.verifyToken],
  recipeController.deleteFavoriteRecipe
);

module.exports = router;
