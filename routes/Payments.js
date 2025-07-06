const express = require("express");
const router = express.Router();
const { auth,isStudent, isInstructor } = require("../middlewares/auth");

const {capturePayment,verifySignature,
    enrolledStudents,sendPaymentSuccessEmail} 
    = require("../controllers/Payments");

//
router.post('/capturepayment',auth,isStudent,capturePayment)
router.post('/verifysignature',auth,isStudent,verifySignature)


router.post('sendpaymentsuccessemail',auth,isStudent,sendPaymentSuccessEmail)


module.exports = router