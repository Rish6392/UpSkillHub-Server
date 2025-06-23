const Course = require("../models/Course");
const Tag = require("../models/tags");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


// createCourse handler function
exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const { courseName, courseDescription, whatYouWillLearn, tag } = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !tag || !thumbnail) {
            return res.ststus(400).json({
                success: false,
                messge: "All fields are required"
            })
        }

        //check for instructor
        const userId = req.user.id; //payload main store hain Auth controller login
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ", instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found"
            })
        }

        // cheque given tag is valid or not 
        const tagDetails = await Tag.findById(tag);
        if (!tagDetails) {
            return res.status(404).json({
                success: false,
                message: "Tag Details not found"
            })
        }

        // Upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME); // env

        // create an entry in db for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        //Instructor(User) ko update karna hai
        // add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true},
        );

        // update the tag Schema
        // hw

        // return response
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}







// getAllCourses handler function

exports.showAllCourses = async(req,res)=>{
    try{tally
        // TODO: change te below statement incrementally
       const allCourses = await Course.find({});

          return res.status(200).json({
            success:true,
            message:"Data for all courses fetched successfuly",
            data:allCourses,
          })                                     

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Cannot fetch course data",
            error:error.message
        })
    }
}