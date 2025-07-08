const User = require("../models/User")
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt")
const crypto = require("crypto");

// resetPasswordToken
exports.resetPasswordToken = async (req, res) => {
    try {
        // get email from req ki body
        const { email } = req.body;

        // check user for this email,email verification
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: "your Email is not registered with us"
            });
        }
        // generate token
        const token = crypto.randomUUID();
        // update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true }
        );
        // create url
        const url = `http://localhost:3000/update-password/${token}`  // frontend ka link
        // send mail containing the url
        await mailSender(email,
            "Password Reset Link",
            `Password Reset Link:${url}`
        );
        // return response
        return res.json({
            success: true,
            message: "Email Sent successfully,please check email and change password"
        })


    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password token"
        })
    }
}


// resetPassword

exports.resetPassword = async (req, res) => {
    try {
        //data fetch
        // ye token body main kaise aaya hamne tho token url main pas kiya tha uper=> frontend ne daali hai (ans)
        const { password, confirmPassword, token } = req.body;
        // validate
        if (password != confirmPassword) {
            return res.json({
                success: false,
                message: 'Password not matching'
            });
        }
        // get userdetails from db using token
        const userDetails = await User.findOne({ token: token });
        // if no entry- invalid token
        if (!userDetails) {
            return res.json({
                success: false,
                message: "Token Invalid"
            })
        }
        // token time check 
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is Expired.please regernerate yur token"
            })
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // password update
        await User.findOneAndUpdate(
            { token: token },
            {
                password: hashedPassword,
                token: null,
                resetPasswordExpires: null,
            },
            { new: true },
        )
        // return  password 
        return res.status(200).json({
            success: true,
            message: "password reset successfully"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password "
        })
    }
}