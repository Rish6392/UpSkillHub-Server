const express = require("express");
const router = express.Router();
const { auth,isStudent, isInstructor } = require("../middleware/auth");

const {createCourse,updateCourse,
    deleteCourse,showAllCourses,getCourseDetails,
    fetchInstructorCourses,getFullCourseDetails
} 
= require("../controllers/Course")



//
router.post('/createcourse',auth,isInstructor,createCourse)
router.post('/updatecourse',auth,isInstructor,updateCourse)
router.post('/deletecourse',auth,isInstructor,deleteCourse)
router.get('/showallcourses',auth,isStudent,showAllCourses)
router.get('/getcoursedetails',auth,isStudent,getCourseDetails)
router.post('/fetchinstructorcourse',auth,isInstructor,fetchInstructorCourses)



module.exports = router