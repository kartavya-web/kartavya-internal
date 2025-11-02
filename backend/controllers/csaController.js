const asyncHandler = require("express-async-handler");
const ChildSponsorMap = require("./../models/ChildSponsorMapSchema");
const Student = require("./../models/Student");
const User = require("./../models/User");
const generateEmailTemplate = require("../Utils/mailTemplate");
const { sendEmail } = require("../Utils/mailer");

// @route GET/api/allotment/
const getVerifiedDonations = asyncHandler(async (req, res) => {
  const verifiedDonations = await ChildSponsorMap.find({}).lean();
  res.json(verifiedDonations);
});

// @route GET/api/allotment/action
const getChildTobeAlloted = asyncHandler(async (req, res) => {
  const sponsorid = req.headers["sponsorid"];

  const students = await Student.find({
    sponsorshipStatus: true,
    $expr: {
      $gt: [
        {
          $multiply: ["$annualFees", { $divide: ["$sponsorshipPercent", 100] }],
        },
        { $multiply: [{ $size: "$sponsorId" }, 8500] },
      ],
    },
    sponsorId: { $not: { $in: [sponsorid] } },
  }).lean();

  res.status(200).json({ success: true, data: students });
});

const sendAllotmentEmail = async (sponsor, student) => {
  const emailTemplate = generateEmailTemplate({
    title: "Child Allotment Confirmation - Kartavya IIT(ISM)",
    message: `Hello ${sponsor.name}, Thank you for choosing to sponsor a child. We have allotted you a child to support through our platform.`,
    highlightBox: true,
    highlightContent: `Please login to your account to view the child's details.`,
    buttonLink: "https://kartavya.org/login",
    buttonText: "Login to Kartavya",
    additionalContent: `
    <p>We truly appreciate your continued support towards the education of underprivileged children.</p>
    <p>The details of the newly allotted child are updated on the website. We will keep you updated on their progress.</p>
    <p>If you have any questions regarding this allotment, feel free to reach out to our team.</p>
`,
  });
  await sendEmail({
    to: sponsor.email,
    subject: "Kartavya - Child Allotment Confirmation",
    html: emailTemplate,
    text: `You have been allotted a child to sponsor:\n
    Thank you for supporting education through Kartavya.`,
  });
  console.log("Allotment email sent successfully!");
};

// @route PATCH /api/allotment/allot
const allotChild = asyncHandler(async (req, res) => {
  const { sponsorId, studentId } = req.body;

  try {
    const sponsor = await User.findById(sponsorId);
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    const student = await Student.findById(studentId).lean();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const donationObject = await ChildSponsorMap.findOne({
      user: sponsorId,
    });

    if (!donationObject || donationObject.donations.length === 0) {
      throw new Error("No donation record found for the sponsor.");
    }

    const firstDonation = donationObject.donations[0];
    const numChild = firstDonation.numChild;

    if (numChild <= 0) {
      throw new Error("Invalid donation record: numChild is already zero.");
    }

    if (student.sponsorId?.includes(sponsorId)) {
      throw new Error("Student is already allotted to this sponsor.");
    }

    // Push studentId into the sponsoredStudents attribute of Sponsor
    await User.updateOne(
      { _id: sponsorId },
      { $addToSet: { sponsoredStudents: studentId } }
    );

    // Push sponsorId into the sponsorId attribute of Student
    await Student.updateOne(
      { _id: studentId },
      { $addToSet: { sponsorId: sponsorId } }
    );

    // Decrement numChild in the first donation object
    firstDonation.numChild -= 1;

    if (firstDonation.numChild > 0) {
      // Still children left in this donation → just save
      await donationObject.save();
    } else if (firstDonation.numChild === 0) {
      // Remove this donation from the array
      donationObject.donations = donationObject.donations.filter(
        (donation) =>
          donation.donationId.toString() !== firstDonation.donationId.toString()
      );

      console.log(donationObject.donations, "Updated donations after removal");

      if (donationObject.donations.length > 0) {
        // Some donations still exist → save the reduced array
        console.log("Saving donation object with reduced donations array");
        await donationObject.save();
      } else {
        // No donations left → remove the entire document
        console.log(
          "Removing entire ChildSponsorMap document as no donations left"
        );
        await ChildSponsorMap.deleteOne({ _id: donationObject._id });
      }
    }

    await sendAllotmentEmail(sponsor, student);
    res.status(200).json({ message: "Child allotted successfully!" });
  } catch (error) {
    console.error("Allotment failed:", error);
    res.status(400).json({
      message:
        error.message || "An error occurred during the allotment process.",
    });
  }
});

const deAllotChild = asyncHandler(async (req, res) => {
  const { sponsorId, studentId } = req.body;

  const sponsor = await User.findById(sponsorId).select("-hash -salt");
  if (!sponsor) {
    return res.status(404).json({ message: "Sponsor not found" });
  }

  const student = await Student.findById(studentId);
  if (!student) {
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
});

// @route POST /api/allotment/add-donation
const addDonationsToCSM = asyncHandler(async (req, res) => {
  const { user, name, donations } = req.body;

  if (!user || !name || !donations || donations.length === 0) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const existingDonationId = await ChildSponsorMap.findOne({
    "donations.donationId": donations[0].donationId,
  });

  console.log(existingDonationId, "existingDonationId");

  if (existingDonationId) {
    return res
      .status(400)
      .json({ message: "This donation already exists in CSM Table." });
  }

  const rawDonation = donations[0];

  const donationToAdd = {
    donationId: rawDonation.donationId,
    date: new Date(rawDonation.date),
    numChild: rawDonation.numChild || 0,
  };

  let existingMap = await ChildSponsorMap.findOne({ user });

  if (existingMap) {
    existingMap.donations.push(donationToAdd);
    await existingMap.save();
    return res
      .status(200)
      .json({ message: "Donation added to existing sponsor map." });
  } else {
    const newMap = new ChildSponsorMap({
      user,
      name,
      donations: [donationToAdd],
    });

    await newMap.save();
    return res
      .status(201)
      .json({ message: "New sponsor map created and donation added." });
  }
});

module.exports = {
  getVerifiedDonations,
  getChildTobeAlloted,
  allotChild,
  deAllotChild,
  addDonationsToCSM,
};

// donation_id = 679bbe64100a5ecc13b97481
// sponsor_id = 6797b538702bd44e7da764f4
