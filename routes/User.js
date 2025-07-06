const express = require("express");
const router = express.Router();

const { login, signUp, sendOTP,changePassword} = require("../controllers/Auth")
const { resetPasswordToken , resetPassword} = require("../controllers/ResetPassword")

const {auth} = require("../middlewares/auth")


//Reason: You're sending data (email/password) to the server to authenticate a user.

//POST is used to submit data to be processed,
//  usually resulting in a change on the server (like creating a session/token)

router.post('/login',login)
router.post('/signup',signUp)
router.post('/sendotp',sendOTP);
router.put("/changepassword",auth,changePassword);
//PUT is typically used for updating existing data.

//reset pass

router.post('/reset-password-token',resetPasswordToken);
router.post('/reset-password',resetPassword);

module.exports = router;