const express = require("express");
const router = express.Router();
const authJwt = require("../middleware/authJwt.js");
const verifySignUp = require("../middleware/verifySignUp.js");
const authController = require("../controllers/controller.auth.js");
const userController = require("../controllers/controller.users.js");
const categoryController = require("../controllers/controller.categories.js");
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

router.get("/api/test/all", userController.all);

router.get(
  "/api/test/user",
  [authJwt.verifyToken, authJwt.isUser],
  userController.user
);

router.get(
  "/api/test/mod",
  [authJwt.verifyToken, authJwt.isModerator],
  userController.moderator
);

router.get(
  "/api/test/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  userController.admin
);

router.post("/api/user/upload-image", userController.uploadImage);

router.get("/api/user/get-image/:id", userController.getImage);

// Categorys controllers

router.get("/api/categories/", categoryController.getCategories);

// Recipes controllers

router.post("/api/recipes/", recipeController.addRecipe);
router.get("/api/recipes/", recipeController.getRecipes);
router.get("/api/recipes/categories", recipeController.getRecipeCategories);
router.get("/api/recipes/get-image/:id", recipeController.getImage);

module.exports = router;
