// routes/studentPublicRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentControllers.js");
const { checkToken } = require("../middleware.js");

router.get(
  "/:studentId/sponsors",
  checkToken,
  studentController.getSponsorsByStudentId
);

module.exports = router;
