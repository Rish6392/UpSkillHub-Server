const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth");

const {updateProfile,deleteAccount,getAllUserDetails,
    updateDisplayPicture,getEnrolledCourses,instructorDashboard
} = require("../controllers/Profile");

//
router.post("/deleteProfile",auth, deleteAccount);
router.put("/updateProfile",auth,updateProfile)

router.get("/getUserDetails",auth,getAllUserDetails);
router.get("/instructorDashboard",auth,isInstructor, instructorDashboard);


router.get("/getEnrolledCourses",auth,getEnrolledCourses)
router.put("/updateDisplayPicture",auth,updateDisplayPicture)

module.exports = router
