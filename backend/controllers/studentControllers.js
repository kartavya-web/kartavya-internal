const Student = require("../models/Student");
const User = require("../models/User");
const azure = require("../azureStorage");
const asyncHandler = require("express-async-handler");
const { get } = require("https");
const { get: httpGet } = require("http");

// @route POST/Students
const addNewStudent = asyncHandler(async (req, res, profilePictureUrl) => {
  const {
    studentName,
    gender,
    dob,
    school,
    studentClass,
    fathersName,
    fathersOccupation,
    mothersName,
    mothersOccupation,
    address,
    annualIncome,
    centre,
    currentSession,
    contactNumber,
    aadhar,
    domicile,
    birthCertificate,
    disability,
    singleParent,
    relevantCertificate,
  } = req.body;

  if (!studentName || !gender || !dob || !fathersName || !centre) {
    return res
      .status(400)
      .json({ message: "Please fill the compulsory information" });
  }

  if ((!school && studentClass) || (school && !studentClass)) {
    return res
      .status(400)
      .json({ message: "Student must be in some school or class" });
  }

  if (contactNumber && contactNumber.length != 10) {
    return res.status(400).json({ message: "Invalid Contact number" });
  }

  if (annualIncome <= 0) {
    return res.status(400).json({ message: "Invalid Annual Income" });
  }

  const lastStudent = await Student.findOne().sort({ createdAt: -1 });

  // Extract the last sequence number and increment it
  let lastSequenceNumber = lastStudent
    ? parseInt(lastStudent.rollNumber.split("/")[2])
    : 1;
  let newSequenceNumber = lastSequenceNumber + 1;

  // Generate the new roll number
  let newRollNumber = `K/DHN/${newSequenceNumber}`;

  const studentObject = {
    rollNumber: newRollNumber,
    studentName,
    gender,
    dob,
    school,
    class: studentClass,
    fathersName,
    fathersOccupation,
    mothersName,
    mothersOccupation,
    address,
    annualIncome,
    centre,
    currentSession,
    contactNumber,
    profilePhoto: profilePictureUrl,
    aadhar,
    domicile,
    birthCertificate,
    disability,
    singleParent,
    relevantCertificate,
  };

  const stud = await Student.create(studentObject);
  if (stud) {
    res.status(201).json({
      message: `New Student ${studentName} with ${newRollNumber} Roll Number Added. Please write on Physical Form also`,
    });
  } else {
    res.status(400).json({ message: "Unable to Add Student" });
  }
});

// @route GET/Students
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find()
    .select(
      "studentName rollNumber class centre activeStatus sponsorshipStatus school"
    )
    .lean();

  res.json(students);
});

// @route GET/Students/:rollNumber
const getStudentByRoll = asyncHandler(async (req, res) => {
  const rollNumber = req.params.rollNumber;
  const student = await Student.findOne({ rollNumber })
    .populate("sponsorId", "name email batch")
    .exec();

  console.log(student, "student found");

  if (!student) {
    return res.status(400).json({ message: "No Such Student found " });
  }

  const sponsors = await User.find(
    { _id: { $in: student.sponsorId } },
    { name: 1, email: 1, _id: 1 }
  ).lean();

  // attach sponsors' info
  const studentData = {
    ...student.toObject(),
    sponsors,
  };

  res.json(studentData);
});

// @route PATCH/Students
const updateStudent = asyncHandler(async (req, res) => {
  const {
    rollNumber,
    studentName,
    gender,
    dob,
    school,
    class: studentClass,
    fathersName,
    fathersOccupation,
    mothersName,
    mothersOccupation,
    address,
    annualIncome,
    centre,
    currentSession,
    contactNumber,
    activeStatus,
    sponsorshipStatus,
    annualFees,
    sponsorshipPercent,
    aadhar,
    domicile,
    birthCertificate,
    disability,
    singleParent,
    relevantCertificate,
    comment,
  } = req.body;

  if (
    !rollNumber ||
    !studentName ||
    !gender ||
    !dob ||
    !fathersName ||
    !centre
  ) {
    console.log("body", req.body);
    return res
      .status(400)
      .json({ message: "Please fill the compulsory information" });
  }

  if ((!school && studentClass) || (school && !studentClass)) {
    return res
      .status(400)
      .json({ message: "Student must be in some school or class" });
  }

  if (contactNumber && contactNumber.length !== 10) {
    return res.status(400).json({ message: "Invalid Contact number" });
  }

  if (annualIncome <= 0) {
    return res.status(400).json({ message: "Invalid Annual Income" });
  }

  if (
    (sponsorshipStatus === true && sponsorshipPercent == 0) ||
    (sponsorshipStatus === false && sponsorshipPercent != 0)
  ) {
    return res
      .status(400)
      .json({ message: "Enter valid sponsorship % for student" });
  }

  if (activeStatus == "false" && comment == "") {
    return res
      .status(400)
      .json({ message: "Enter the remark for making the student inactive" });
  }

  if (sponsorshipStatus == true && activeStatus == "false") {
    return res
      .status(400)
      .json({ message: "The student is Inactive so can't be sponsored" });
  }

  if (sponsorshipPercent < 0 || sponsorshipPercent > 100) {
    return res.status(400).json({ message: "Invalid Sponsorship Percent" });
  }

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { rollNumber },
      {
        studentName,
        gender,
        dob,
        school,
        class: studentClass,
        fathersName,
        fathersOccupation,
        mothersName,
        mothersOccupation,
        address,
        annualIncome,
        centre,
        currentSession,
        contactNumber,
        activeStatus,
        sponsorshipStatus,
        annualFees,
        sponsorshipPercent,
        aadhar,
        domicile,
        birthCertificate,
        disability,
        singleParent,
        relevantCertificate,
        comment,
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: `Data of ${studentName} updated`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating student", error });
  }
});

// @route PUT/Students
const updateResult = asyncHandler(async (req, res, resultUrl) => {
  const rollNumber = req.params.rollNumber;
  const { sessionTerm } = req.body;

  if (!rollNumber) {
    return res.status(400).json({ message: "Roll Number required" });
  }

  if (!resultUrl) {
    return res.status(400).json({ message: "Result not uploaded properly" });
  }

  if (!sessionTerm) {
    return res.status(400).json({ message: "Session term is required" });
  }

  try {
    const student = await Student.findOne({ rollNumber }).exec();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!Array.isArray(student.result)) {
      student.result = [];
    }

    const existingIndex = student.result.findIndex(
      (r) => r.sessionTerm === sessionTerm
    );

    if (existingIndex !== -1) {
      const oldURL = student.result[existingIndex].url;
      if (oldURL) {
        await azure.deleteFromAzureBlob(oldURL);
      }
      student.result[existingIndex].url = resultUrl;
    } else {
      student.result.push({ sessionTerm: sessionTerm, url: resultUrl });
    }

    await student.save();

    res.status(200).json({
      message: `Result for "${sessionTerm}" of ${student.studentName} updated successfully.`,
    });
  } catch (error) {
    console.error("Error updating student result:", error);
    res.status(500).json({
      message: "Error updating the result of student",
      error: error.message,
    });
  }
});

const deleteResult = asyncHandler(async (req, res) => {
  const rollNumber = req.params.rollNumber;
  const { sessionTerm } = req.body;

  if (!rollNumber) {
    return res.status(400).json({ message: "Roll Number required" });
  }

  if (!sessionTerm) {
    return res.status(400).json({ message: "Session term required" });
  }

  try {
    const student = await Student.findOne({ rollNumber }).exec();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!Array.isArray(student.result) || student.result.length === 0) {
      return res.status(400).json({ message: "No results to delete" });
    }

    const index = student.result.findIndex(
      (r) => r.sessionTerm === sessionTerm
    );
    if (index === -1) {
      return res
        .status(404)
        .json({ message: "Result for this session term not found" });
    }

    const oldURL = student.result[index].url;
    if (oldURL) {
      await azure.deleteFromAzureBlob(oldURL);
    }

    student.result.splice(index, 1);
    await student.save();

    res.status(200).json({
      message: `Result for "${sessionTerm}" of ${student.studentName} deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting student result:", error);
    res.status(500).json({
      message: "Error deleting the result of student",
      error: error.message,
    });
  }
});

// @route PATCH/Students/:rollNumber
const updateProfilePhoto = asyncHandler(async (req, res, profileUrl) => {
  const rollNumber = req.params.rollNumber;

  if (!rollNumber) {
    return res.status(400).json({ message: "Roll Number required" });
  }

  if (!profileUrl) {
    return res
      .status(400)
      .json({ message: "Profile photo not uploaded properly" });
  }

  try {
    const student = await Student.findOne({ rollNumber }).exec();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const oldURL = student.profilePhoto;
    if (oldURL) {
      await azure.deleteFromAzureBlob(oldURL);
    }

    student.profilePhoto = profileUrl;
    await student.save();

    res.status(200).json({
      message: `Result of ${student.studentName} updated successfully.`,
    });
  } catch (error) {
    console.error("Error updating student profile photo:", error);
    res.status(500).json({
      message: "Error updating the profile photo of student",
      error: error.message,
    });
  }
});

// @route DELETE/Students/:rollNumber
const deleteStudent = asyncHandler(async (req, res) => {
  const rollNumber = req.params.rollNumber;

  if (!rollNumber) {
    return res.status(400).json({ message: "Roll Number required" });
  }

  const student = await Student.findOne({ rollNumber }).exec();
  if (!student) {
    return res.status(400).json({ message: "Student not found" });
  }

  if (student.sponsorshipStatus) {
    return res
      .status(400)
      .json({ message: "First cancel sponsorship of child" });
  }

  const result = await student.deleteOne();
  res.json({ message: "Student Deleted" });
});

// @route GET /students/get-base64-image?url=IMAGE_URL
const getBase64Image = asyncHandler(async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send("Missing image URL");

  const fetchBase64FromUrl = (url) => {
    return new Promise((resolve, reject) => {
      const client = url.startsWith("https") ? get : httpGet;

      client(url, (resp) => {
        if (resp.statusCode !== 200) {
          reject(new Error(`HTTP Status Code: ${resp.statusCode}`));
          return;
        }

        const contentType = resp.headers["content-type"] || "image/jpeg";
        const chunks = [];

        resp.on("data", (chunk) => chunks.push(chunk));
        resp.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const base64 = buffer.toString("base64");
          resolve(`data:${contentType};base64,${base64}`);
        });
      }).on("error", reject);
    });
  };

  try {
    const base64 = await fetchBase64FromUrl(imageUrl);
    res.send(base64);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to fetch image");
  }
});

module.exports = {
  addNewStudent,
  getAllStudents,
  getStudentByRoll,
  updateStudent,
  deleteStudent,
  updateResult,
  deleteResult,
  updateProfilePhoto,
  getBase64Image,
};
