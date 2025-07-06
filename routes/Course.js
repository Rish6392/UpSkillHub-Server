const express = require("express");
const router = express.Router();
const { auth,isStudent, isInstructor,isAdmin} = require("../middlewares/auth");

const {createCourse,updateCourse,
    deleteCourse,showAllCourses,getCourseDetails,
    fetchInstructorCourses,getFullCourseDetails
} 
= require("../controllers/Course")

const {updateCourseProgress} = require('../controllers/CourseProgress');

const {createCategory,showAllCategory,categoryPageDetails} = require('../controllers/Category');

const {createSection,updateSection,deleteSection} = require('../controllers/Section');

const {createSubSection,updateSubSection,deleteSubSection} = require('../controllers/SubSection');

const {createRating,getAverageRating,getAllRating} = require('../controllers/RatingAndReview');




//
router.get("/instructorCourses",auth,isInstructor,fetchInstructorCourses);
router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse",auth,isInstructor,updateCourse)
router.post("/deleteCourse",auth,isInstructor,deleteCourse)
router.post("/updateCourseProgress",auth,isStudent,updateCourseProgress);

router.get("/getAllCourses",showAllCourses);
router.post("/getCourseDetails",auth,getCourseDetails)
router.post("/getFullCourseDetails",getFullCourseDetails)

router.post("/createCategory",auth,isAdmin,createCategory)
router.post("/getCategoryPageDetails",categoryPageDetails);
router.get("/showAllCategories",showAllCategory);

router.post("/addSection", auth, isInstructor, createSection);
router.put("/updateSection", auth, isInstructor, updateSection);
router.delete("/deleteSection",auth,isInstructor, deleteSection);

router.put("/updateSubSection",auth,isInstructor,updateSubSection)
router.delete("/deleteSubSection",auth,isInstructor,deleteSubSection)
router.post("/addSubSection",auth,isInstructor,createSubSection)

router.get("/getAverageRating",getAverageRating)
router.post("/createRating",auth,isStudent,createRating)
router.get("/getReviews",getAllRating)



module.exports = router