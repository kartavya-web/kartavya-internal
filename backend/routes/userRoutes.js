const express = require("express");
const router = express.Router();
const { checkToken, checkVerified } = require("../middleware");
const userController = require("../controllers/userControllers.js");

// existing login route (keep this)
router.route("/").post(userController.loginUser);

// ---- sponsor/student routes ----
// get all sponsors (populated)
router.get("/sponsors", userController.getAllSponsors);

// get sponsor by id
router.get("/sponsors/:id", userController.getSponsorById);

module.exports = router;
