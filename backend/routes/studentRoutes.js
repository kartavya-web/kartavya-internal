const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentControllers.js");
const multer = require("multer");
const azure = require("../azureStorage.js");
const catchAsync = require("../Utils/catchAsync.js");
const path = require("path");
const crypto = require("crypto");
const asyncHandler = require("express-async-handler");

const sanitizeFilename = (originalname) => {
  const ext = path.extname(originalname).toLowerCase();
  const timestamp = Date.now();
  const uniqueId = crypto.randomBytes(8).toString("hex");
  return `profile_photo_${timestamp}_${uniqueId}${ext}`;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.originalname = sanitizeFilename(file.originalname);
    cb(null, true);
  },
});

router
  .route("/")
  .get(studentController.getAllStudents)
  .post(
    upload.single("profilePicture"),
    catchAsync(azure.uploadToAzureBlob),
    catchAsync(async (req, res) => {
      const profilePictureUrl = req.fileUrl ? req.fileUrl : "";
      await studentController.addNewStudent(req, res, profilePictureUrl);
    })
  );

router.get("/get-base64-image", studentController.getBase64Image);


router.get("/by-roll", studentController.getStudentByRoll);
router.patch("/update", studentController.updateStudent);
router.delete("/delete", studentController.deleteStudent);

router.patch(
  "/profile-picture",
  upload.single("profilePicture"),
  asyncHandler(azure.uploadToAzureBlob),
  asyncHandler(async (req, res) => {
    const profileUrl = req.fileUrl || "";
    await studentController.updateProfilePhoto(req, res, profileUrl);
  })
);

router.delete("/result", studentController.deleteResult);
router.patch(
  "/result",
  upload.single("result"),
  asyncHandler(azure.uploadToAzureBlob),
  asyncHandler(async (req, res) => {
    const resultUrl = req.fileUrl || "";
    await studentController.updateResult(req, res, resultUrl);
  })
);

module.exports = router;
