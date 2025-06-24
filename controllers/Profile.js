const Profile =require("../models/Pofile")
const User = require("../models/User")

//updateProfile
exports.updateProfile = async(req,res)=>{
    try{
       //get data
       const {dateOfBirth="",about="",contactNumber,gender} = req.body;
       //get userId
       const id = req.user.id; // auth middleware Auth controller se payload me diya gaya hai
       //validate
       if(!contactNumber || !gender || !id){
        return res.status(400).json({
            success:false,
            message:"All fields are required "
        });
       }
       //find profile
       const userDetails = await User.findById(id);
       const profileId = userDetails.additionalDetails;
       const profileDetails = await Profile.findById(profileId)
       //update profile
       // create ke alawa save method ka use
       profileDetails.dateOfBirth=dateOfBirth;
       profileDetails.about=about;
       profileDetails.gender = gender;
       profileDetails.contactNumber = contactNumber;
       await profileDetails.save();
       //return res
       return res.status(200).json({
        success:true,
        message:"Profile Updated Successfully",
        profileDetails,
       })

    }
    catch(error){
         return res.status(500).json({
            success:false,
            error:error.message,
         })
    }
}


//deleteAccount
// Explore =>>> how can we schedule the deletion operation
//coronjob
exports.deleteAccount = async(req,res)=>{
    try{
       //get id
       const id = req.user.id;
       //validation
       const userDetails = await User.findById(id);
       if(!userDetails){
        return res.status(404).json({
            success:false,
            message:'User not found'
        });
       }
       //delete profile
       await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
       ////TODO:HW unenroll user from all enrolled courses
       //delete user
       await User.findByIdAndDelete({_id:id});
       //return res
       return res.status(200).json({
        success:true,
        message:'User deleted Successfully'
       })

    }
    catch(error){
         return res.status(500).json({
            success:false,
            message:"User cannot be deleted"
         })
    }
};



////getAllUserDetails

exports.getAllUserDetails = async(req,res)=>{
    try{
       //get id
       const id = req.user.id;
       //validation
       const userDetails = await User.findById(id).populate("additionalDetails").exec();
       if(!userDetails){
        return res.status(404).json({
            success:false,
            message:'User not found'
        });
       }

       /// db call
       //return res
       return res.status(200).json({
        success:true,
        message:"User data fetched successfully"
       })
    }
    catch(error){
          return res.status(500).json({
            success:false,
            message:error.message,
         })
    }
}