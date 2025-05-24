const Users = require("../models/User");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  try {
    console.log(req.body, "req body");
    const { username, password } = req.body;
    console.log("username", username);
    console.log("password", password);

    const user = await Users.findOne({ username });
    if (!user) {
      console.log('no user with given username found');
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    // if (!user.validatePassword(password)) {
    //   return res.status(401).json({
    //     message: "Invalid credentials",
    //   });
    // }

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

module.exports = {
  loginUser,
};
