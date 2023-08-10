const express = require("express");
const middlewareControllers = require("../app/controllers/middlewareConstrolles");
const router = express.Router();
const apiController = require("../app/controllers/apiController");
router.post(
  "/send-mqtt",
  middlewareControllers.verifyToken,
  apiController.publishUsertoDevice
);
// router.patch(
//   "/addSmoke",
//   middlewareControllers.verifyToken,
//   apiController.addSmokeValueinArrayValue
// );
router.get(
  "/getalluserinUserManager",
  // middlewareControllers.verifyToken,
  apiController.getAllUserinUserManager
);
router.get(
  "/getAllUserWarninginUserManager",
  // middlewareControllers.verifyToken,
  apiController.getAllUserWarninginUserManager
);
router.get(
  "/getInbox",
  middlewareControllers.verifyToken,
  apiController.getInbox
);
router.get(
  "/getNodesOfUser",
  // middlewareControllers.verifyToken,
  apiController.getNodesOfUser
);
router.get("/getLocationofAllUser", apiController.getLocationofAllUser);

module.exports = router;
