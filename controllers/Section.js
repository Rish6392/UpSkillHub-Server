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
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            },
        });
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
        const { sectionName, sectionId, courseId } = req.body;
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

        const courseDetails = await Course.findById(courseId).populate({
            path: "courseContent",
            populate: {
                path: "subSection"
            },
        });
        //return res
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            data:courseDetails,
        })

    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: "Unable to update Section,please try again",
            error: error.message,
        })
    }
}


//deleteSection

exports.deleteSection = async (req, res) => {
  try {
    // Assuming that we are sending id in params
    // const {sectionId} = req. ;
    const { sectionId, courseId } = req.body;
    const courseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $pull: {
          courseContent: sectionId,
        },
      },
      {
        new: true,
      }
    )
      .populate({
        path:"courseContent",
        populate : {
          path:"subSection"
        }
      })
      .exec();

    await Section.findByIdAndDelete(sectionId);

    //do we need to delete the entry from schema?

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: courseDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section , please try again ",
      error: error.message,
    });
  }
};