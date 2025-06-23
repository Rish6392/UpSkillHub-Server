const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


//auth
exports.auth = async(req,res,next)=>{
    try{
       // extract token
       const token = req.cookies.token
                        ||req.boby.token
                        ||req.header("Authorisation").replace("Bearer ","");

        // if token miiissing,then return response
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            });
        }   
        
        // verify the token
        try{
          const decode = jwt.verify(token,process.env.JWT_SECRET);
          console.log(decode);
          req.user=decode;
          
        }
        catch(err){
           // verifiaction issue
           return res.status(401).json({
            succes:false,
            message:"token is invalid"
           })
        }
        next();
    }
    catch(error){
      return res.status(401).json({
        success:false,
        message:"Something went wrong while validating the token"
      })
    }
}

// isStudent
exports.isStudent = async(req,res,next)=>{
    try{
      // ek tarika accountType ko req.user se chek karlo
      if(req.user.accountTypesattus(401) !=="Student"){
        return res.status(401).json({
            success:false,
            message:"this is a protected route for Student only"
        })
      }
      next();

    }
    catch(error){
       return res.status(500).json({
           success:false,
           message:"User role canot be verified,please try again"
       })
    }
}

// isInstructor
exports.isInstructor = async(req,res,next)=>{
    try{
      // ek tarika accountType ko req.user se chek karlo
      if(req.user.accountTypesattus(401) !=="isInstructor"){
        return res.status(401).json({
            success:false,
            message:"this is a protected route for Instructor only"
        })
      }
      next();

    }
    catch(error){
       return res.status(500).json({
           success:false,
           message:"User role canot be verified,please try again"
       })
    }
}

// isAdmin
exports.isAdmin = async(req,res,next)=>{
    try{
      // ek tarika accountType ko req.user se chek karlo
      if(req.user.accountTypesattus(401) !=="isAdmin"){
        return res.status(401).json({
            success:false,
            message:"this is a protected route for Admin only"
        })
      }
      next();

    }
    catch(error){
       return res.status(500).json({
           success:false,
           message:"User role canot be verified,please try again"
       })
    }
}

