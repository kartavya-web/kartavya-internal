const User = require("../models/User");
const Sponsor = require("../models/User");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username=${username}`);

    const user = await User.findOne({ username });
    if (!user) {
      console.log('no user with given username found');
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    if (!user.validatePassword(password)) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    const sanitizedUser = {
      username: user.username,
      name: user.name,
      email: user.email,
      contactNumber: user.contactNumber,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      currentJob: user.currentJob,
      governmentOfficial: user.governmentOfficial,
      ismPassout: user.ismPassout,
      batch: user.batch,
      kartavyaVolunteer: user.kartavyaVolunteer,
      yearOfService: user.yearOfService,
      typeOfSponsor: user.typeOfSponsor,
      role: user.role,
    };
    const token = jwt.sign(sanitizedUser, process.env.JWT_KEY, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: sanitizedUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      name: err.name,
      error: err.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      name: err.name,
      error: err.message,
    });
  }
}

// GET /api/users/sponsors  -> returns sponsors populated with students
const getAllSponsors = async (req, res) => {
  try {
    console.log('Getting all sponsors...');
    const Student = require("../models/Student");

    // Fetch all users who could be sponsors
    const sponsors = await User.find()
      .select('_id name email contactNumber dateOfBirth gender currentJob totalDonation profileImage')
      .lean();

    // For each sponsor, query the Student collection directly for the source of truth
    const sponsorsWithCounts = await Promise.all(
      sponsors.map(async (sponsor) => {
        const [studentCount, sponsoredStudents] = await Promise.all([
          Student.countDocuments({ sponsorId: sponsor._id }),
          Student.find(
            { sponsorId: sponsor._id },
            "studentName rollNumber class centre school profilePhoto sponsorshipStatus"
          ).lean()
        ]);

        return {
          ...sponsor,
          sponsoredStudents,
          studentCount
        };
      })
    );

    // Sort sponsors by number of sponsored students in descending order
    const sortedSponsors = sponsorsWithCounts.sort((a, b) =>
      (b.studentCount || 0) - (a.studentCount || 0)
    );

    console.log('Found sponsors count:', sortedSponsors.length);
    res.status(200).json(sortedSponsors);
  } catch (err) {
    console.error("getAllSponsors error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/users/sponsors/:id
const getSponsorById = async (req, res) => {
  try {
    const sponsor = await Sponsor.findById(req.params.id)
      .populate({
        path: "sponsoredStudents",
        model: "Student",  // This matches the model name in Student.js
        select: "studentName class centre profilePhoto sponsorshipStatus",
      })
      .lean();
    if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });
    res.status(200).json(sponsor);
  } catch (err) {
    console.error("getSponsorById error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  loginUser,
  getUserById,
  getAllSponsors,
  getSponsorById,
};
