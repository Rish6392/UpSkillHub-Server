const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");


//createRating
exports.createRating = async(req,res)=>{
    try{
       //get UserId
       const userId = req.user.id;
       //fetchData from req body
       const {rating,review,courseId} = req.body;
       //check if user is enrolled or not
       const courseDetails = await Course.findOne(
                               {_id:courseId,
                                studentEnrolled:{$elemmatch:{$eq:userId}}
                                });

         if(!courseDetails) {
            return res.status(404).json({
                success:false,
                message:'Student is not enrolled in the course',
            });
         }                     
       //check if user already reviewed the course
       const alreadyreviewed = await RatingAndReview.findOne({
                                              user:userId,
                                              course:courseId,
                                                });

         if(alreadyreviewed){
            return res.status(403).json({
                success:false,
                message:'Cpurse is already reviewed by the User'
            });
         }                                       
       //create rating review
       const ratingReview = await RatingAndReview.create({
                                  rating,review,
                                  course:courseId,
                                  user:userId,
                                });
       //update course with this rating and review
     const updatedCourseDetails=  await Course.findByIdAndUpdate(_id:courseId,
        {
            $push:{
                ratingAndReviews:ratingReview._id,
            }
        },
    {new:true});

    console.log(updatedCourseDetails);
       
       //return res
       return res.status(200).json({
        success:true,
        message:"rating and review created Successfully",
        ratingReview,
       })
    }
    catch(error){
         console.log(error);
         return res.status(500).json({
            success:false,
            message:error.message,
         })
    }
}




//getAveragerating




//getAllRating