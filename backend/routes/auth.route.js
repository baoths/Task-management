const express = require("express");
const router = express.Router();
const { userCheck, authCheck } = require("../middleware");
const container = require("../container");

// Get controller from DI container
const controller = container.getAuthController();

// returns token
router.post("/login", controller.login);

router.post(
  "/register",
  [userCheck.checkDuplicateUsernameOrEmail],
  controller.register
);

router.post("/logout", [authCheck.verifyToken], controller.logout);

module.exports = router;