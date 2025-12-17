const express = require("express");
const router = express.Router();
const { authCheck } = require("../middleware");
const container = require("../container");

// Get controller from DI container
const controller = container.getTaskController();

//check login and use authentication
router.get("/getTasks", [authCheck.verifyToken], controller.getTasks);

router.post("/markDone", [authCheck.verifyToken], controller.markDone);

router.post("/markUnDone", [authCheck.verifyToken], controller.markUnDone);

router.post(
  "/deActivateTask",
  [authCheck.verifyToken],
  controller.deActivateTask
);

router.post("/createTask", [authCheck.verifyToken], controller.createTask);

router.post("/updateTask", [authCheck.verifyToken], controller.updateTask);

module.exports = router;
