const asyncHandler = require("express-async-handler");
const ChildSponsorMap = require("./../models/ChildSponsorMapSchema");
const mongoose = require("mongoose");
const Student = require("./../models/Student");
const User = require("./../models/User");

// @desc Get all Donations
// @route GET/api/allotment/
// @access Private
const getVerifiedDonations = asyncHandler(async (req, res) => {
  const verifiedDonations = await ChildSponsorMap.find({}).lean();
  console.log("verifiedDonations 🥲🥲", verifiedDonations);
  res.json(verifiedDonations);
});

// @desc Get all Students who need Sponsor allotment
// @route GET/api/allotment/action
// @access Private
const getChildTobeAlloted = asyncHandler(async (req, res) => {
  const sponsorid = req.headers["sponsorid"];
  console.log(sponsorid, "❤️❤️");

  const students = await Student.find({
    sponsorshipStatus: true,
    $expr: {
      $gt: [
        {
          $multiply: ["$annualFees", { $divide: ["$sponsorshipPercent", 100] }],
        },
        { $multiply: [{ $size: "$sponsorId" }, 8000] },
      ],
    },
    sponsorId: { $not: { $in: [sponsorid] } },
  }).lean();

  res.status(200).json({ success: true, data: students });
});

// Transaction Controller
const performCATransaction = async (sponsorId, studentId) => {
  const session = await mongoose.startSession();
  console.log(sponsorId, "sponsorId 👍👍");
  session.startTransaction();

  try {
    const donationObject = await ChildSponsorMap.findOne({
      user: sponsorId,
    }).session(session);

    if (!donationObject || donationObject.donations.length === 0) {
      throw new Error("No donation record found for the sponsor.");
    }

    const firstDonation = donationObject.donations[0];
    const donationId = firstDonation.donationId;
    const numChild = firstDonation.numChild;

    if (numChild <= 0) {
      throw new Error("Invalid donation record: numChild is already zero.");
    }

    // Step 1: Check if the student is already allotted to the sponsor
    const student = await Student.findById(studentId).session(session);
    if (!student) {
      throw new Error("Student not found.");
    }

    if (student.sponsorId?.includes(sponsorId)) {
      throw new Error("Student is already allotted to this sponsor.");
    }

    // Step 2: Push studentId into the sponsoredStudents attribute of User
    await User.updateOne(
      { _id: sponsorId },
      { $addToSet: { sponsoredStudents: studentId } },
      { session }
    );

    // Step 3: Push sponsorId into the sponsorId attribute of Student
    await Student.updateOne(
      { _id: studentId },
      { $addToSet: { sponsorId: sponsorId } },
      { session }
    );

    // Step 4: Decrease the numChild value in the donations array
    firstDonation.numChild -= 1;

    if (firstDonation.numChild === 0) {
      // Remove the donation if numChild becomes zero
      donationObject.donations = donationObject.donations.filter(
        (donation) => donation.donationId.toString() !== donationId.toString()
      );
    }

    // Save the modified donationObject
    await donationObject.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    console.log("Transaction committed successfully! 👍👍");
  } catch (error) {
    await session.abortTransaction();
    console.error("Transaction failed, rolled back!", error);
    throw error;
  } finally {
    session.endSession();
  }
};

// @desc Allot Student to the Sponsor
// @route PATCH /api/allotment/allot
// @access Private
const allotChild = asyncHandler(async (req, res) => {
  const { sponsorId, studentId } = req.body; // Removed unnecessary `await`

  try {
    await performCATransaction(sponsorId, studentId);
    res.status(200).json({ message: "Child allotted successfully!" });
  } catch (error) {
    console.error("Allotment failed:", error);

    // Provide a more structured error response
    res.status(400).json({
      message:
        error.message || "An error occurred during the allotment process.",
    });
  }
});


const deAllotChild = asyncHandler(async (req, res) => {
  const { sponsorId, studentId } = req.body; 

  const sponsor = await User.findById(sponsorId).lean();
  if (!sponsor) {
    return res.status(404).json({ message: "Sponsor not found" });
  }

  const student = await Student.findById(studentId).lean();
  if(!student) {
    return res.status(404).json({ message: "Student not found" });
  } 

  sponsor.sponsoredStudents = sponsor.sponsoredStudents.filter(
    (sId) => sId.toString() !== studentId.toString()
  );
  student.sponsorId = student.sponsorId.filter(
    (sId) => sId.toString() !== sponsorId.toString()
  );
  await sponsor.save();
  await student.save();

  return res.status(200).json({
    message: "Child de-allotted successfully!",
  });
})

module.exports = {
  getVerifiedDonations,
  getChildTobeAlloted,
  allotChild,
  deAllotChild
};

// donation_id = 679bbe64100a5ecc13b97481
// sponsor_id = 6797b538702bd44e7da764f4
