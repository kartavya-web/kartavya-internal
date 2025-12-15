const express = require("express");
const router = express.Router();
const { checkToken, authorizeAdmin } = require("../middleware");
const userController = require("../controllers/userControllers.js");

// existing login route (keep this)
router.route("/").post(userController.loginUser);

// ---- sponsor/student routes ----
// get all sponsors (populated)
router.get("/sponsors", checkToken, authorizeAdmin, userController.getAllSponsors);

// get sponsor by id
router.get("/sponsors/:id", checkToken, authorizeAdmin, userController.getSponsorById);

module.exports = router;
