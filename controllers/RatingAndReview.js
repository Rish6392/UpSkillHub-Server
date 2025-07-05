const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");



//createRating
exports.createRating = async (req, res) => {
    try {
        //get UserId
        const userId = req.user.id;
        //fetchData from req body
        const { rating, review, courseId } = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentEnrolled: { $elemmatch: { $eq: userId } }
            });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            });
        }
        //check if user already reviewed the course
        const alreadyreviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyreviewed) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the User'
            });
        }
        //create rating review
        const ratingReview = await RatingAndReview.create({
            rating, review,
            course: courseId,
            user: userId,
        });
        //update course with this rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            { _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            { new: true });

        console.log(updatedCourseDetails);

        //return res
        return res.status(200).json({
            success: true,
            message: "rating and review created Successfully",
            ratingReview,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}




//getAveragerating
exports.getAverageRating = async (req, res) => {
    try {
        //grt courseId
        const { courseId } = req.body;
        //calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                }

            }
        ])
        //return avg rating
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }

        //if no rating review exist
        return res.status(200).json({
            success: true,
            message: "Average Rating is 0,no rating given till now",
            averageRating: 0,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}



//getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
    try {
        //
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();


        return res.status(200).json({
            success: true,
            messsage: "All reviews fetched successfully",
            data: allReviews,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}