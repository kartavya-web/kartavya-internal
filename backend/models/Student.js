const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  profilePhoto: {
    type: String,
    required: false,
  },
  result: [
    {
      sessionTerm: String,
      url: String
    }
  ],
  class: {
    type: String,
    required: false,
  },
  school: {
    type: String,
    required: false,
  },
  fathersName: {
    type: String,
    required: true,
  },
  fathersOccupation: {
    type: String,
    required: false,
  },
  mothersName: {
    type: String,
    required: false,
  },
  mothersOccupation: {
    type: String,
    required: false,
  },
  centre: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
  },
  contactNumber: {
    type: String,
    required: false,
  },
  annualIncome: {
    type: Number,
    required: false,
  },
  currentSession: {
    type: String,
    required: false,
  },
  sponsorshipStatus: {
    type: Boolean,
    required: false,
    default: false,
  },
  annualFees: {
    type: Number,
    required: false,
  },
  sponsorId: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  sponsorshipPercent: {
    type: Number,
    required: false,
    default: 0,
  },
  activeStatus: {
    type: Boolean,
    required: false,
    default: true,
  },
  aadhar: {
    type: Boolean,
    default: false,
  },
  domicile: {
    type: Boolean,
    default: false,
  },
  birthCertificate: {
    type: Boolean,
    default: false,
  },
  disability: {
    type: Boolean,
    default: false,
  },
  singleParent: {
    type: Boolean,
    default: false,
  },
  relevantCertificate: {
    type: Boolean,
    default: false,
  },
  comment: {
    type: String,
    default: "",
  },
}, {timestamps: true});

const StudentModel = mongoose.model("Student", studentSchema);
module.exports = StudentModel;
