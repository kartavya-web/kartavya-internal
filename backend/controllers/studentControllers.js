const User = require("../models/User");
const Student = require("../models/Student");
const Sponsors = require("../models/Child_Sponsors");
const azure = require("../azureStorage");
const asyncHandler = require("express-async-handler");

// @desc Create New Student
// @route POST/Students
// @access Private
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

  const lastStudent = await Student.findOne().sort({createdAt: -1});

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

// @desc Get all Students
// @route GET/Students
// @access Private
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find()
    .select(
      "-fathersName -fathersOccupation -mothersName -mothersOccupation -gender -annualIncome -sponsor -sponsorshipPercent -currSession -contactNumber"
    )
    .lean();

  // if no student is there then return empty array -> change made by Amit Bhagat

  // if (!students?.length) {
  //   return res.status(400).json({ message: "No Student found" });
  // }

  res.json(students);
});

// @desc Get a particular Student by rollNumber
// @route GET/Students/:rollNumber
// @access Private
const getStudentByRoll = asyncHandler(async (req, res) => {
  const rollNumber = req.params.rollNumber;
  const student = await Student.findOne({ rollNumber }).populate("sponsorId", "name").exec();

  console.log(student, "student found"); 

  if (!student) {
    return res.status(400).json({ message: "No Such Student found " });
  }
  res.json(student);
});

// @desc Update a particular Student by rollNumber
// @route PATCH/Students
// @access Private
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

  if (sponsorshipStatus == true && activeStatus == "false"){
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

// @desc Update Result of a particular Student by rollNumber
// @route PUT/Students
// @access Private
const updateResult = asyncHandler(async (req, res, resultUrl) => {
  const rollNumber = req.params.rollNumber;

  // Validate required parameters
  if (!rollNumber) {
    return res.status(400).json({ message: "Roll Number required" });
  }

  if (!resultUrl) {
    return res.status(400).json({ message: "Result not uploaded properly" });
  }

  try {
    const student = await Student.findOne({ rollNumber }).exec();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const oldURL = student.result;
    if (oldURL) {
      await azure.deleteFromAzureBlob(oldURL);
    }

    student.result = resultUrl;
    await student.save();

    res.status(200).json({
      message: `Result of ${student.studentName} updated successfully.`,
    });
  } catch (error) {
    console.error("Error updating student result:", error);
    res.status(500).json({
      message: "Error updating the result of student",
      error: error.message,
    });
  }
});

// @desc Update profilePhoto of a particular Student by rollNumber
// @route PATCH/Students/:rollNumber
// @access Private
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

// @desc Delete a particular Student by rollNumber
// @route DELETE/Students/:rollNumber
// @access Private
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

module.exports = {
  addNewStudent,
  getAllStudents,
  getStudentByRoll,
  updateStudent,
  deleteStudent,
  updateResult,
  updateProfilePhoto,
};
