const express = require("express");
const router = express.Router();
const csaController = require("../controllers/csaController.js");

router.route("/").get(csaController.getVerifiedDonations);
router.get("/action", csaController.getChildTobeAlloted);
router.get("/available", csaController.getChildTobeAlloted);
router.route("/allot").patch(csaController.allotChild);
router.route("/deallot").patch(csaController.deAllotChild);
router.route("/addDonationsToCSM").post(csaController.addDonationsToCSM);
router.route("/process-donation").post(csaController.processDonation);
router.route("/pipeline").get(csaController.getDonationPipeline);

router.get("/session/:session", csaController.getSessionSponsorshipData);
router.get("/sessions", csaController.getAvailableSessions);

router.get("/session/:session/excel", csaController.exportSessionExcel);

module.exports = router;