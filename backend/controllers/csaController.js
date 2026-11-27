const asyncHandler = require("express-async-handler");
const ChildSponsorMap = require("./../models/ChildSponsorMapSchema");
const Student = require("./../models/Student");
const User = require("./../models/User");
const generateEmailTemplate = require("../Utils/mailTemplate");
const { sendEmail } = require("../Utils/mailer");
const Donation = require("./../models/Donation");
const ExcelJS = require("exceljs");

const getCurrentAcademicYear = (now = new Date()) => {
  const year = now.getFullYear();
  const month = now.getMonth();

  return month >= 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

const verifiedDonationsForYear = (academicYear) => ({
  path: "donations",
  match: { verified: true, rejected: false, academicYear },
  select: "donationDate numChild",
  options: { sort: { donationDate: -1 } },
});

const getSponsorshipCounts = (sponsor) => {
  const totalNumChild = sponsor.donations.reduce(
    (sum, donation) => sum + (donation.numChild || 0),
    0
  );
  const currentSponsored = sponsor.sponsoredStudents?.length ?? 0;

  return {
    totalNumChild,
    currentSponsored,
    pendingAllotment: totalNumChild - currentSponsored,
  };
};

// @route GET/api/allotment/
const getVerifiedDonations = asyncHandler(async (req, res) => {
  const currentAcademicYear = getCurrentAcademicYear();

  const users = await User.find()
    .populate(verifiedDonationsForYear(currentAcademicYear))
    .select("name email contactNumber sponsoredStudents donations")
    .lean();

  const verifiedDonations = users
    .filter((user) => user.donations && user.donations.length > 0)
    .map((user) => ({
      user: user._id,
      name: user.name || "",
      email: user.email || "",
      contactNumber: user.contactNumber || "",
      ...getSponsorshipCounts(user),
      latestDonationDate: user.donations[0]?.donationDate || null,
      academicYear: currentAcademicYear,
    }))
    .filter((entry) => entry.pendingAllotment > 0);

  res.json(verifiedDonations);
});

const availableStudentFilter = {
  sponsorshipStatus: true,
  $expr: {
    $gt: [
      {
        $multiply: ["$annualFees", { $divide: ["$sponsorshipPercent", 100] }],
      },
      { $multiply: [{ $size: { $ifNull: ["$sponsorId", []] } }, 8500] },
    ],
  },
};

// @route GET /api/allotment/action
// @route GET /api/allotment/available
const getChildTobeAlloted = asyncHandler(async (req, res) => {
  const sponsorid = req.headers["sponsorid"];
  const query = { ...availableStudentFilter };

  if (sponsorid) {
    query.sponsorId = { $not: { $in: [sponsorid] } };
  }

  const students = await Student.find(query)
    .select("studentName rollNumber class centre school profilePhoto")
    .lean();

  res.status(200).json({
    success: true,
    data: students,
  });
});

const sendAllotmentEmail = async (sponsor) => {
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
  if (!sponsorId || !studentId) {
    return res.status(400).json({ message: "Sponsor and student are required." });
  }

  try {
    const academicYear = getCurrentAcademicYear();
    const result = await User.db.transaction(async (session) => {
      const sponsor = await User.findById(sponsorId)
        .select("name email donations sponsoredStudents")
        .session(session)
        .populate(verifiedDonationsForYear(academicYear));
      if (!sponsor) {
        return { status: 404, message: "Sponsor not found" };
      }

      const student = await Student.findById(studentId).session(session);
      if (!student) {
        return { status: 404, message: "Student not found" };
      }

      if (student.sponsorId.includes(sponsorId)) {
        return {
          status: 409,
          message: "Student is already allotted to this sponsor.",
        };
      }

      if (getSponsorshipCounts(sponsor).pendingAllotment <= 0) {
        return {
          status: 409,
          message: "This sponsor has no remaining verified allotments for the current academic year.",
        };
      }

      const isAvailable = await Student.exists({
        _id: student._id,
        ...availableStudentFilter,
      }).session(session);
      if (!isAvailable) {
        return {
          status: 409,
          message: "This student is no longer available for allotment.",
        };
      }

      sponsor.sponsoredStudents.addToSet(student._id);
      await sponsor.save({ session });

      student.sponsorId.addToSet(sponsor._id);
      const history = student.sponsorshipHistory.find(
        (entry) => entry.session === student.currentSession
      );
      if (history) {
        history.sponsors.addToSet(sponsor._id);
      } else {
        student.sponsorshipHistory.push({
          session: student.currentSession,
          sponsors: [sponsor._id],
        });
      }
      await student.save({ session });

      // Keep existing map entries in sync when they cover a qualifying donation.
      const donationIds = new Set(
        sponsor.donations.map((donation) => donation._id.toString())
      );
      const map = await ChildSponsorMap.findOne({ user: sponsor._id })
        .session(session);
      const entry = map?.donations.find(
        (donation) =>
          donation.numChild > 0 && donationIds.has(donation.donationId?.toString())
      );
      if (entry) {
        entry.numChild -= 1;
        if (entry.numChild === 0) {
          map.donations.pull(entry._id);
        }
        if (map.donations.length > 0) {
          await map.save({ session });
        } else {
          await map.deleteOne({ session });
        }
      }

      return { sponsor };
    });

    if (result.status) {
      return res.status(result.status).json({ message: result.message });
    }

    let emailSent = false;
    try {
      await sendAllotmentEmail(result.sponsor);
      emailSent = true;
    } catch (error) {
      console.error("Allotment confirmation email failed:", error);
    }

    return res.status(200).json({
      message: "Child allotted successfully!",
      emailSent,
    });
  } catch (error) {
    console.error("Allotment failed:", error);
    return res.status(400).json({
      message: error.message || "An error occurred during the allotment process.",
    });
  }
});

const getSessionSponsorshipData = asyncHandler(async (req, res) => {
  try {
    const { session } = req.params;

    const students = await Student.find({
      sponsorshipHistory: {
        $elemMatch: {
          session: session,
        },
      },
    })
      .populate({
        path: "sponsorshipHistory.sponsors",
        select: "name email contactNumber profileImage",
      })
      .select(
        "studentName rollNumber class centre school profilePhoto sponsorshipHistory"
      )
      .lean();

    const formattedStudents = students.map((student) => {
      const history = student.sponsorshipHistory.find(
        (h) => h.session === session
      );

      return {
        _id: student._id,
        studentName: student.studentName,
        rollNumber: student.rollNumber,
        class: student.class,
        centre: student.centre,
        school: student.school,
        profilePhoto: student.profilePhoto,

        sponsorCount: history?.sponsors?.length || 0,

        sponsors:
          history?.sponsors?.map((sponsor) => ({
            _id: sponsor._id,
            name: sponsor.name,
            email: sponsor.email,
            contactNumber: sponsor.contactNumber,
            profileImage: sponsor.profileImage,
          })) || [],
      };
    });

    const uniqueSponsors = new Set();

    formattedStudents.forEach((student) => {
      student.sponsors.forEach((sponsor) => {
        uniqueSponsors.add(sponsor._id.toString());
      });
    });

    res.status(200).json({
      success: true,
      session,
      stats: {
        totalStudents: formattedStudents.length,
        totalSponsors: uniqueSponsors.size,
      },
      students: formattedStudents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

const getAvailableSessions = asyncHandler(async (req, res) => {
  const sessions = await Student.distinct(
    "sponsorshipHistory.session"
  );

  sessions.sort().reverse();

  res.status(200).json({
    sessions,
  });
});

const exportSessionExcel = asyncHandler(async (req, res) => {
  try {

    const { session } = req.params;

    const students = await Student.find({
      sponsorshipHistory: {
        $elemMatch: {
          session: session,
        },
      },
    })
      .populate({
        path: "sponsorshipHistory.sponsors",
        select: "name email contactNumber profileImage",
      })
      .select(
        "studentName class centre school profilePhoto sponsorshipHistory"
      )
      .lean();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(session);

    worksheet.columns = [
      { header: "Student Name", key: "studentName", width: 25 },
      { header: "Class", key: "class", width: 10 },
      { header: "Centre", key: "centre", width: 20 },
      { header: "School", key: "school", width: 30 },
      { header: "Sponsor Name", key: "sponsorName", width: 25 },
      { header: "Sponsor Email", key: "sponsorEmail", width: 30 },
      { header: "Contact", key: "contact", width: 20 },
    ];


    for (const student of students) {
      const history = student.sponsorshipHistory.find(
        (h) => h.session === session
      );

      if (!history || !history.sponsors?.length) {
        continue;
      }
      console.log(history.sponsors[0]);

      for (const sponsor of history.sponsors) {
        worksheet.addRow({
          studentName: student.studentName,
          class: student.class,
          centre: student.centre,
          school: student.school || "N/A",
          sponsorName: sponsor.name,
          sponsorEmail: sponsor.email,
          contact: sponsor.contactNumber ? Number(sponsor.contactNumber) : "",
        });
      }
    }

    worksheet.getRow(1).font = {
      bold: true,
    };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${session}.xlsx`
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
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
    return res.status(400).json({ message: "This donation already exists in CSM Table." });
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

const addSponsorHistoryForStudents = async (studentIds, sponsorId) => {
  const students = await Student.find({
    _id: { $in: studentIds }
  });

  for (const student of students) {
    const session = student.currentSession;

    if (!student.sponsorshipHistory) {
      student.sponsorshipHistory = [];
    }

    let history = student.sponsorshipHistory?.find(
      h => h.session === session
    );

    if (history) {
      const alreadyExists = history.sponsors.some(
        s => s.toString() === sponsorId.toString()
      );

      if (!alreadyExists) {
        history.sponsors.push(sponsorId);
      }
    } else {
      student.sponsorshipHistory.push({
        session,
        sponsors: [sponsorId]
      });
    }

    await student.save();
  }
};

// @route POST /api/allotment/process-donation
const processDonation = asyncHandler(async (req, res) => {
  const { donationId, academicYear } = req.body;

  if (!donationId || !academicYear) {
    return res.status(400).json({ message: "Missing required fields: donationId, academicYear" });
  }

  try {
    const Donation = require("./../models/Donation");

    const donation = await Donation.findById(donationId).populate("user");
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.processed) {
      return res.status(400).json({ message: "This donation has already been processed" });
    }

    const sponsor = await User.findById(donation.user._id);
    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    const newCount = donation.numChild;
    const currentCount = await Student.countDocuments({
      sponsorId: sponsor._id,
    });
    // **CASE 1: newCount > currentCount (Increase in Sponsorship)**
    if (newCount > currentCount) {
      const additionalChildren = newCount - currentCount;

      // to get all the students sponsored last session by this
      const existingStudents = await Student.find(
        { sponsorId: sponsor._id },
        "_id"
      );

      // Add sponsor history for the retained students
      await addSponsorHistoryForStudents(
        existingStudents.map(x => x._id),
        sponsor._id
      );

      // Add extra children count to CSM table for new allotment
      await ChildSponsorMap.findOneAndUpdate(
        { user: donation.user._id },
        {
          $set: {
            user: donation.user._id,
            name: sponsor.name,
            lastUpdated: new Date(),
          },
          $push: {
            donations: {
              donationId: donationId,
              date: donation.donationDate,
              numChild: additionalChildren,
            },
          },
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );

      console.log(`[Case 1] Sponsor ${donation.user._id}: Increased sponsorship. ${additionalChildren} new children pending allotment.`);
    }

    // **CASE 2: newCount < currentCount (Reduction in Sponsorship)**
    else if (newCount < currentCount) {
      const studentsToDeallot = currentCount - newCount;
      const existingStudents = sponsor.sponsoredStudents || [];

      // Retain only newCount students, remove the rest
      const studentsToRemove = existingStudents.slice(newCount);
      const retainedStudents = existingStudents.slice(0, newCount);

      // Add sponsor history for the retained students
      await addSponsorHistoryForStudents(
        retainedStudents,
        sponsor._id
      );

      // De-allocate students
      for (const studentId of studentsToRemove) {
        const student = await Student.findById(studentId);
        if (student) {
          student.sponsorId = student.sponsorId.filter(
            (sId) => sId.toString() !== donation.user._id.toString()
          );
          await student.save();
          console.log(`[Case 2] De-allocated student ${studentId} from sponsor ${donation.user._id}`);
        }
      }

      // Update sponsor with retained students
      sponsor.sponsoredStudents = retainedStudents;
      await sponsor.save();

      console.log(`[Case 2] Sponsor ${donation.user._id}: Reduced sponsorship. De-allocated ${studentsToDeallot} students.`);
    }

    // **CASE 3: newCount == currentCount (No Change)**
    else {

      const existingStudents = await Student.find(
        { sponsorId: sponsor._id },
        "_id"
      );

      await addSponsorHistoryForStudents(
        existingStudents.map(x => x._id),
        sponsor._id
      );

      console.log(`[Case 3] Sponsor ${donation.user._id}: Sponsorship renewed for academic year ${academicYear}. No changes required.`);
    }

    await Donation.updateOne(
      { _id: donationId },
      {
        $set: {
          processed: true,
          academicYear: academicYear,
          lastProcessedDate: new Date(),
        }
      }
    );

    let caseType = newCount > currentCount ? "1 (Increase)" : newCount < currentCount ? "2 (Reduction)" : "3 (No Change)";

    res.status(200).json({
      success: true,
      message: `Donation processed successfully - Case ${caseType}`,
      details: {
        donationId: donationId,
        donationAmount: donation.amount,
        newCount: newCount,
        currentCount: currentCount,
        academicYear: academicYear,
        caseType: caseType,
      }
    });

  } catch (error) {
    console.error("Donation processing failed:", error);
    res.status(400).json({
      message: error.message || "An error occurred during donation processing.",
    });
  }
});

const getDonationPipeline = asyncHandler(async (req, res) => {
  try {

    const pipelineDonations = await Donation.find({
      verified: true,
      rejected: false,
      processed: false,
    })
      .populate("user", "name email sponsoredStudents batch")
      .sort({ donationDate: -1 })
      .lean();

    const donationsByUser = {};
    const Student = require("./../models/Student");

    for (const donation of pipelineDonations) {
      if (!donation.user) {
        console.error(
          "Invalid donation found:",
          donation._id
        );
        continue;
      }

      const userId = donation.user._id.toString();

      if (!donationsByUser[userId]) {
        const studentCount = await Student.countDocuments({ sponsorId: donation.user._id });

        donationsByUser[userId] = {
          userId: donation.user._id,
          userName: donation.user.name,
          userEmail: donation.user.email,
          userBatch: donation.user.batch,
          currentCount: studentCount,
          donations: [],
          totalDonationAmount: 0,
          totalNumChild: 0,
        };
      }

      donationsByUser[userId].donations.push({
        id: donation._id,
        amount: donation.amount,
        donationDate: donation.donationDate,
        numChild: donation.numChild,
        contactNumber: donation.contactNumber,
        recieptUrl: donation.recieptUrl,
        academicYear: donation.academicYear,
      });
      console.log(`Donation ID: ${donation._id}, Academic Year: ${donation.academicYear}`);

      donationsByUser[userId].totalDonationAmount += donation.amount;
      donationsByUser[userId].totalNumChild += donation.numChild;
    }

    const groupedDonations = Object.values(donationsByUser);

    res.status(200).json({
      success: true,
      data: groupedDonations,
      total: pipelineDonations.length,
      uniqueSponsors: groupedDonations.length,
    });
  } catch (error) {
    console.error("Error fetching donation pipeline:", error);
    res.status(400).json({
      message: error.message || "Failed to fetch donation pipeline.",
    });
  }
});

module.exports = {
  getVerifiedDonations,
  getChildTobeAlloted,
  allotChild,
  deAllotChild,
  addDonationsToCSM,
  processDonation,
  getDonationPipeline,
  getSessionSponsorshipData,
  getAvailableSessions,
  exportSessionExcel
};

// donation_id = 679bbe64100a5ecc13b97481
// sponsor_id = 6797b538702bd44e7da764f4