const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

const { uploadVideoToCloudinary } = require("../utils/imageUploader");

//create Subsection

exports.createSubSection = async (req, res) => {
    try {
        //fetch data from Req body
        const { sectionId, title, description,timeDuration } = req.body;
        //extract file/vodeo
        const video = req.files.videoFile;
        //validation
        if (!sectionId || !title || !description || !video || !timeDuration) {
            return res.status(400).json({
                success: false,
                message: "Fill All fields"
            })
        }

        const sectionDetails = await Section.findById(sectionId);

        if (!sectionDetails) {
            return res.status(404).json({
                success: false,
                message: "This Section doesn't exits",
            });
        }
        //uplaod video to cloudinary
        const uploadDetails = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME)
        console.log("Upload Details",uploadDetails)
        //create a subsection
        const subSectionDetails = await SubSection.create({
            title,
            timeDuration,
            description,
            video: uploadDetails.secure_url,
        })
        //update section with this sub section object id
        const updatedSection = await Section.findByIdAndUpdate({ _id: sectionId },
            {
                $push: {
                    subSection: subSectionDetails._id,
                }
            },
            { new: true }
        ).populate("subSection");
        //HW : log updated section here,after adding populated query 
        //return response
        return res.status(200).json({
            success: true,
            message: "Sub Section Created Successfully",
            data: updatedSection,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
};


///HW : updateSubSection
exports.updateSubSection = async (req, res) => {
    try {
        //data input
        const { subSectionId, title, timeDuartion, description } = req.body;
        //validation
        if (!title || !subSectionId || !timeDuartion || !description) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties"
            });
        }
        // // If video is also being updated
        // if (req.files && req.files.videoFile) {
        //     const video = req.files.videoFile;
        //     const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //     updateData.videoUrl = uploadDetails.secure_url;
        // }
        //update data 
        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId,
            { title, timeDuartion, description },
            { new: true },
        );
        // If subsection not found
        if (!updatedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }
        //return res
        return res.status(200).json({
            success: true,
            message: "SubSection Updated Successfully",
            updatedSubSection,
        })

    }
    catch (error) {
        return res.status(500).json({
            success: true,
            message: "Unable to update SubSection,please try again",
            error: error.message,
        })
    }
}


//HW: deleteSubSection


exports.deleteSubSection = async (req, res) => {
    try {
        // Step 1: Get subSectionId and sectionId from request body
        const { subSectionId, sectionId } = req.body;

        // Step 2: Validate input
        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing subSectionId or sectionId",
            });
        }

        // Step 3: Delete the SubSection document
        const deletedSubSection = await SubSection.findByIdAndDelete({
            _id: subSectionId
        });

        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )

        // Step 5: Send response
        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            data:updatedSection,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete SubSection",
            error: error.message,
        });
    }
};

