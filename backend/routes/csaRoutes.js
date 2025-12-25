const express = require("express");
const router = express.Router();
const csaController = require("../controllers/csaController.js");

router.route("/").get(csaController.getVerifiedDonations);
router.get("/action", csaController.getChildTobeAlloted);
router.get("/available", csaController.getChildTobeAlloted);
router.route("/allot").patch(csaController.allotChild);
router.route("/deallot").patch(csaController.deAllotChild);
router.route("/addDonationsToCSM").post(csaController.addDonationsToCSM);

module.exports = router;