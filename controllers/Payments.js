const { instance } = require("../config/razorpay");
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail"); // create
const { default: mongoose } = require("mongoose");


// capture the payment and initiate the Razorpay Order
exports.capturePayment = async (req, res) => {
    try {
        //get courseId,and UserId
        const { course_id } = req.body;
        const userId = req.user.id;
        //validation
        if (!userId) {
            return res.json({
                success: false,
                messsage: "please provide valid User ID"
            })
        }
        //valid courseId
        if (!course_id) {
            return res.json({
                success: false,
                messsage: "please provide valid course ID"
            })
        }
        //valid courseDetail
        let course;
        try {
            course = await Course.findById(course_id);
            if (!course) {
                return res.json({
                    success: false,
                    messsage: "could not find the course"
                })
            }

            //user already pay for the same course
            const uid = new mongoose.Types.ObjectId(userId); // string userId ko ObjectId main convert karliya
            if (course.studentEnrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled"
                })
            }
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }


        //order create
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes: {
                courseId: course_id,
                userId,
            }
        };

        try {
            // initiate the payment using razorpay 
            const paymentResponse = await instance.orders.create(options);
            console.log(paymentResponse);

            //return res
            return res.status(200).json({
                success: true,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                thumbnail: course.thumbnail,
                orderId: paymentResponse.id,
                currency: paymentResponse.currency,
                amount: paymentResponse.amount,
            })

        }
        catch (error) {
            console.log(error);
            res.json({
                success: false,
                message: "Could not initiate Order"
            })
        }

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
