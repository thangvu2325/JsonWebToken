const express = require("express");
const router = express.Router();
const authController = require("../app/controllers/AuthController");
const middlewareControllers = require("../app/controllers/middlewareConstrolles");
router.get("/register", authController.register);
router.get("/login", authController.login);

router.post("/login", authController.handleLogin);
router.post("/refresh", authController.refreshToken);
router.post("/register", authController.signup);
router.post(
  "/logout",
  middlewareControllers.verifyToken,
  authController.logOut
);

module.exports = router;
