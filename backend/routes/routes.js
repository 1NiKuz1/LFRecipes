const express = require("express");
const router = express.Router();
//const { verifySignUp, authJwt } = require("../middleware");
const authJwt = require("../middleware/authJwt.js");
const verifySignUp = require("../middleware/verifySignUp.js");
const authController = require("../controllers/controller.auth.js");
const userController = require("../controllers/controller.users.js");

router.post(
  "/api/auth/signup",
  [verifySignUp.checkDuplicateLoginOrEmail, verifySignUp.checkRoleExisted],
  authController.signup
);

router.post("/api/auth/signin", authController.signin);

router.get("/api/activate/:link", authController.activate);

router.post("/api/auth/refreshtoken", authController.refreshToken);

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

module.exports = router;
