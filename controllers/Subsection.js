const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const {uploadImageToCloudinary} = require("../utils/imageUploader")


//create Subsection

exports.createSubSection = async(req,res)=>{
    try{
        //fetch data from Req body
        const{sectionId,title,timeDuartion,description} = req.body;
        //extract file/vodeo
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || timeDuartion || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields"
            })
        }
        //uplaod video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        //create a subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuartion:timeDuartion,
            description:description,
            videoUrl :uploadDetails.secure_url,
        })
        //update section with this sub section object id
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                               {$push:{
                                                                subSection:subSectionDetails._id,
                                                               }},
                                                               {new:true}
                                                                        );
        //HW : log updated section here,after adding populated query 
        //return response
        return res.ststus(200).json({
            success:true,
            message:"Sub Section Created Successfully",
            updatedSection,
        });
    }
    catch(error){
         return res.status(500),json({
            success:false,
            message:"Internal server error",
            error:error.message,
         })
    }
};


///HW : updateSubSection

//HW: deleteSubSection