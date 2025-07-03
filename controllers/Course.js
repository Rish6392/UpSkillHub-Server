const Category = require("../models/category");
const Course = require("../models/Course");
///const Tag = require("../models/category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


// createCourse handler function
exports.createCourse = async (req, res) => {
    try {
        //fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag, category, instructions, status } = req.body;
        console.log("instructions", instructions)

        //get thumbnail
        // You're extracting the uploaded thumbnail file from the form.
        //📌 req.files is populated using a file-upload middleware (like express-fileupload or multer).
        const thumbnail = req.files.thumbnail;

        //validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !category || !price) {
            return res.status(400).json({  // 400 Bad Request
                success: false,
                messge: "All fields are required"
            });
        }

        if (!status || status == undefined) {
            status: "Draft";
        }

        //check for instructor
        // You’re using a JWT-based Auth System where, after login, you store the user's ID in req.user (probably using a middleware like auth that decodes the token and attaches user info to req.user).
        //This makes sure that:
        //Only a logged-in user can create a course.
        //You know who exactly is creating the course.

        const userId = req.user.id; //payload main store hain Auth controller login
        const instructorDetails = await User.findById(userId);
        //console.log("Instructor Details: ", instructorDetails);
        // TODO : Verify that userId and instructorDetails._id are same or diffrent ????????????

        if (!instructorDetails) {
            return res.status(404).json({  // 404 Not Found.
                success: false,
                message: "Instructor Details not found"
            })
        }

        // cheque given category is valid or not 
        //You're ensuring the tag provided exists in your Category collection.
        //  This helps avoid saving invalid category references.
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details not found"
            })
        }

        // Upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME); // env

        // create an entry in db for new course
        const newCourse = await Course.create({
            name: courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            tag: tag,
            instructions: instructions,
            status: status,
        });

        //Instructor(User) ko update karna hai
        // add the new course to the user schema of Instructor
        //Updates the instructor’s user document to 
        // add the new course to their list of created courses.
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                },
            },
            { new: true },
        );

        //update the Category Schema
        //Finds the Category by its ID.
        //Pushes the new course's _id into the courses array inside the Tag document.
        //{new: true } makes sure the updated tag is returned (if needed).


        const categorydetail = await Category.findByIdAndUpdate(
            {
                _id: categoryDetails._id,
            },
            {
                $push: {
                    course: newCourse._id,
                },
            },
            { new: true }
        );
        console.log(categorydetail);

        // hw

        // return response
        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
}







// getAllCourses handler function

exports.showAllCourses = async (req, res) => {
    try {
        tally
        // TODO: change te below statement incrementally
        const allCourses = await Course.find({});

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfuly",
            data: allCourses,
        })

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Cannot fetch course data",
            error: error.message
        })
    }
}

//getCourseDetails

exports.getCourseDetails = async (req, res) => {
    try {
        //get courseId
        const { courseId } = req.body;
        //find course details
        const courseDetails = await Course.find(
            { _id: courseId })
            .populate(
                {
                    path: "instructor",
                    populate: {
                        path: "additionalDetails",
                    }
                }
            )
            .populate("category")
            .populate("ratingAndreview")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        //validation
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            })
        }

        //return response
        return res.status(200).json({
            success: true,
            message: "Course Detail fetched Successfully",
            data: courseDetails,
        })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}