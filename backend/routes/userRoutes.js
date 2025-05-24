const express = require("express");
const router = express.Router();
const { checkToken, checkVerified } = require("../middleware");

const userController = require("../controllers/userControllers.js");
router.route("/").post(userController.loginUser);

module.exports = router;
