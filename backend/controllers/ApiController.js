const User = require("../models/Users");
const Student = require("../models/Students");
const Sponsors = require("../models/Child_Sponsors");

const asyncHandler = require("express-async-handler");

const apigetallStudents = asyncHandler(async (req, res) => {
  const students = await Student.find();
  if (!students?.length) {
    return res.status(400).json({ message: "No Student found" });
  }
  res.json(students);
});
const apigetStudentbyRoll = asyncHandler(async (req, res) => {
  const { Roll } = req.params.Roll_number;
  const student = await Student.findOne({ Roll_number: Roll }).exec();

  if (!student?.length) {
    return res.status(400).json({ message: "No Such Student found " });
  }
  res.json(student);
});

module.exports = {
  apigetallStudents,
  apigetStudentbyRoll,
};
