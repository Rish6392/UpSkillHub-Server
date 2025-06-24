const Section = require("../models/Section");
const Course = require("../models/Course")

//createSection

exports.createSection = async (req, res) => {
    try {
        //fetch data
        const { sectionName, courseId } = req.body;
        //validate
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            });
        }
        //create Section
        const newSection = await Section.create({ sectionName });
        //update course with section ObjectId
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id, /// courseContent in model 
                }
            },
            { new: true },
        );
        // hw use populate to replace section/subsection both in the updatedCourseDetails
        // return res
        return res.status(200).json({
            success: true,
            messsage: "Section Created Successfully",
            updatedCourseDetails,
        })
    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: "Unable to create Section,please try again",
            error: error.message,
        })
    }
}

//updateSection

exports.updateSection = async (req, res) => {
    try {
        //data input
        const { sectionName, sectionId } = req.body;
        //validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            });
        }
        //update data 
        const section = await Section.findByIdAndUpdate(sectionId,
                                                           { sectionName },
                                                           { new: true },
                                                            );
        //return res
        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully"
        })

    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: "Unable to create Section,please try again",
            error: error.message,
        })
    }
}


//deleteSection

exports.deleteSection = async(req,res)=>{
    try{
        //getId- asuming that we are sending ID in params
        const {sectionId} = req.params;
        
        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        //return res
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",

        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: "Unable to create Section,please try again",
            error: error.message,
        })
    }
}