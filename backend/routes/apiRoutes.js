const express = require('express');
const router = express.Router();
const studentApiController = require('../controllers/ApiController');

//Route to fetch all students
router.get('/',studentApiController.apigetallStudents)
// Route to fetch student details by roll number
router.get('/:roll_number', studentApiController.apigetStudentbyRoll);

module.exports = router;
