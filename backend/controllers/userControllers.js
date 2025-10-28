const User = require("../models/User");
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

    if(user.role !== "admin") {
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
      yearsOfService: user.yearsOfService,
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
const Sponsor = require("../models/Child_Sponsors"); 
const Student = require("../models/Student");

// GET /api/users/sponsors  -> returns sponsors populated with students
const getAllSponsors = async (req, res) => {
  try {
    console.log('Getting all sponsors...');
    const sponsors = await User.find()
      .populate({
        path: "sponsoredStudents",
        select: "studentName class centre profilePhoto sponsorshipStatus"
      })
      .select('name email contactNumber dateOfBirth gender currentJob totalDonation sponsoredStudents profileImage')
      .lean();
    
    // Sort sponsors by number of sponsored students in descending order
    const sortedSponsors = sponsors.sort((a, b) => 
      (b.sponsoredStudents?.length || 0) - (a.sponsoredStudents?.length || 0)
    );
    
    console.log('Found sponsors:', sortedSponsors);
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
        path: "Sponsored_child",
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

// POST /api/users/sponsors  -> create sponsor
const createSponsor = async (req, res) => {
  try {
    const newSponsor = new Sponsor(req.body);
    await newSponsor.save();
    res.status(201).json({ message: "Sponsor created", sponsor: newSponsor });
  } catch (err) {
    console.error("createSponsor error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/users/sponsors/:sponsorId/assign/:studentId  -> assign student to sponsor
const assignStudentToSponsor = async (req, res) => {
  const { sponsorId, studentId } = req.params;
  try {
    const sponsor = await Sponsor.findById(sponsorId);
    const student = await Student.findById(studentId);
    if (!sponsor || !student) return res.status(404).json({ message: "Sponsor or Student not found" });

    // add student id to sponsor.Sponsored_child if not present
    if (!sponsor.Sponsored_child.some(id => id.toString() === studentId.toString())) {
      sponsor.Sponsored_child.push(studentId);
      await sponsor.save();
    }

    // update student.sponsorId (your schema uses array; adjust if single id)
    if (!student.sponsorId) student.sponsorId = [];
    if (!student.sponsorId.some(id => id.toString() === sponsorId.toString())) {
      student.sponsorId.push(sponsor._id);
    }
    student.sponsorshipStatus = true;
    await student.save();

    res.status(200).json({ message: "Student assigned to sponsor" });
  } catch (err) {
    console.error("assignStudentToSponsor error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/users/students  -> return basic student list
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("studentName class centre sponsorshipStatus sponsorId profilePhoto")
      .populate("sponsorId", "sponsor_name E_mail_id")
      .lean();
    res.status(200).json(students);
  } catch (err) {
    console.error("getAllStudents error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


module.exports = {
  loginUser,
  getUserById,
  getAllSponsors,
  getSponsorById,
  createSponsor,
  assignStudentToSponsor,
  getAllStudents,
};
