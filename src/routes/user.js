const userController = require("../app/controllers/UserController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndUserAuthorization,
} = require("../app/controllers/verifyToken");

const router = require("express").Router();
//GET ALL USERS
router.get("/", verifyToken, userController.getAllUsers);

//DELETE USER
router.delete("/:id", verifyTokenAndUserAuthorization, userController.deleteUser);

module.exports = router;