require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const { logger, logEvents } = require("./middleware/logger");
const Errorhandler = require("./middleware/Errorhandler");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/DBconn.js");
const { checkToken, checkVerified } = require("./middleware.js");

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "dist")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/users", require("./routes/userRoutes"));
app.use(
  "/api/students",
  // checkToken,
  // checkVerified,
  require("./routes/studentRoutes.js")
);
app.use(
  "/api/allotment",
  checkToken,
  checkVerified,
  require("./routes/csaRoutes.js")
);

app.use(Errorhandler);

app.get("*", (req, res) => {
  console.log("Catch-all triggered for:", req.originalUrl);
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
