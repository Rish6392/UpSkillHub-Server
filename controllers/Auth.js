const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");

//send otp
exports.sendOTP = async (req, res) => {

    try {
        ///fetch email from req body
        const { email } = req.body;   //Gets the email value from the request body (client sends JSON like { "email": "test@example.com" }).

        //check if user already exist
        const checkUserPresent = await User.findOne({ email });

        //if user already exist,then return a respone
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: 'User already registered',
            })
        }

        //generate OTP  => download package otp generator
        var otp = otpGenerator.generate(6, {    // error chatgpt saying  otpGenerator.generate(6, {...})
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP generated: ", otp);

        //check unique otp or not
        let result = await OTP.findOne({ otp: otp });

        while (result) {
            otp = otpGenerator(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }

        // entry of this unique otp in your database
        const otpPayload = { email, otp };

        //create an entry for OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response
        res.status(200).json({
            success: true,
            message: 'OTP Sent Successfully',
            otp,
        })
    }
    catch (error) {
        console.log(error);
        return res.json(500).json({
            success: false,
            message: error.message,
        })
    }

}


//signUp

exports.signUp = async (req, res) => {
    try {


        //data fetch karuga from request ki body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        //validate karlo
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                sucess: false,
                message: "All fields are required",
            })
        }
        //2 password match
        if (password != confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not matcch ,please try again",
            });
        }
        //check user already exist or not 

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exist",
            })
        }

        //find most recent OTP stored for the user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);//Sorts the matching documents by the craetedAt field in descending order (most recent first)
        console.log(recentOtp);
        //valdate OTP
        if (recentOtp.length == 0) {
            //OTP not found
            return res.status(400).json({
                success: false,
                message: "OTP not found",
            })
        }
        else if (otp !== recentOtp.otp) {  // error chatgpt saying    recentOtp[0].otp
            //Invalid OTP 
            return res.status(400).json({
                success: false,
                message: "invald OTP",
            });
        }
        //Hash password  =>bcrypt package required
        const hashedPassword = await bcrypt.hash(password, 10);

        //entry create in db
        const profileDetails = await Profile.create({   //
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,
        })

        //return res
        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            user,
        });

    }

    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered .Please try again",
        })

    }
}




// Login
exports.login = async (req, res) => {
    try {
        //get data from req body
        const { email, password } = req.body;
        //validation data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: 'All fields are required,please try again',
            });
        }
        //user cheque exist or not
        const user = await user.findOne({ email }).populate("additional details");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered,please signup first",
            });
        }
        //generate JWT,after password match
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires: new Date(date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully",
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure,please try again",
        });
    }
}


//change password
exports.changePassword = async (req, res) => {
    try {
        //get data from req body
        const { email, oldPassword, newPassword, confirmNewPassword } = req.body;
        //get oldPassword,newpassword,confirmNewPassword

        // Step 2: Validate all required fields
        if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Step 3: Check if new password and confirm password match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match",
            });
        }


        // Step 4: Find user from DB using email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // step 5: Compre old password with the hashed password in DB
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // Step 6: Hash the new Password before storing
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //update password in DB
        user.password = hashedPassword;
        await user.save();



        // Step 5: Send confirmation email
        await mailSender(
            email,
            "Password Changed Successfully",
            `<p>Your password has been updated successfully. If this wasn't you, please reset it immediately or contact support.</p>`
        );

        //return response
        return res.status(200).json({
            success: true,
            message: "Password send Successfully",
            user,
        });
    }
    catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

}


