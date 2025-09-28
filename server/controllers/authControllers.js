import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import userModel from '../model/userModel.js'
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from "../config/emailTemplates.js"

import transporter from '../config/nodemailer.js';
import { replace } from 'react-router-dom';
import { Verified } from 'lucide-react';


export const register = async (req, res) => {
    const {name, email, password} = req.body

    if(!name || !email || !password){
        return res.json({success: false, message: 'missing Details'})
    }

    try{
    // checking the existing user 

        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({ success: false, message: 'User already exists'});
        };


        const hashedPassword = await bcrypt.hash(password, 10)

        // creating and saving new user into the DB
        const user = new userModel({name, email, password: hashedPassword});

        // saving the user 
        await user.save();


        // generating token 
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: "7d"});

        // sending token to user 
        res.cookie("token", token, {

            // only http request can access this token
            httpOnly:true ,

            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            // expiring day
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //  sending welcome email to the new registered user 
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email, //user-email
            subject: 'Welcome to GIODcodes',
            html: `<p>Welcome to <strong>GIODcodes</strong> website!<br>Your account has been created with email ID: <em>${email}</em></p>`

            // text:`Welcome to GIODcodes website. your account has been created with email id: ${email}`
        }
        await transporter.sendMail(mailOptions);
       
        

        // return response 
        return res.json({success: true});

    }
    catch(error) {
       return  res.json({success: false, message: error.message})
    }
}

// controller function for user LOgin

export const login = async (req, res) => {
    const {email, password} = req.body;

    // email validation (if empty)
    if(!email || !password){
        return res.json({success: false, message: 'Email and Password are required' })
    }

    try{
       const user = await userModel.findOne({email});

        // ifr user is not available 
        if(!user){
            return res.json({succes: false, message: 'invalid email'})
        }

        // compare the password inserted and that of the database 
        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.json({succes: false, message: 'invalid password'})
        }
         // generating token 
         const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: "7d"});

         // sending token to user 
         res.cookie("token", token, {
 
             // only http request can access this token
             httpOnly:true ,
 
             secure: process.env.NODE_ENV === 'production',
             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
             // expiring day
             maxAge: 7 * 24 * 60 * 60 * 1000
         });

        

        //  the user has successfully loggedIn
        return res.json({success: true});

    }
    catch(error){
        return res.json({seccess: false, message: error.message})
    }
}

// log out controller function

export const logout = async (req, res) => { 
    try {
        // removing token
        res.clearCookie('token',{

            httpOnly:true ,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        })
        // successfully logged out 
            return res.json({ success: true, message: "logged Out"})

    } catch(error) {
        return res.json({success: false, message: error.message})
    }
}



//  send verification OTP to the User's Email

export const sendVerifyOtp = async (req, res) => {
    try{
        const userId = req.userId;
        console.log("userId:", userId);

        const user = await userModel.findById(userId);
        console.log("user object:", user);


        if(user.isAccountVerified){
            return res.json({ success: false, message:'Account already Verified'})
        }

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
          }
     // generating OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;

        // expires in 24hrs 
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        // sending OTP to email 
        const mailOption = { 
            from: process.env.SENDER_EMAIL,
            to: user.email, //user-email
            subject: 'Account Verfication Otp',
            // text: `Your OTP is ${otp}. verify your account using this OTP`
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOption);

        res.json({ success:true, message: 'verification OTP sent to Email'})

    } catch (error) {
        res.json({ success: false, message: error.message})
    }

  

}


// verify the users account

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    

    if(!userId || !otp) {
        return res.json({ success: false, message: 'missing Details'})
    }
    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({ success: false, message: 'user not found'});
        
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success: false, message: 'invalid OTP'})
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({ success: false, message:'OTP Expired' })
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({success: true, message: 'Email verified successfully'})
        

    }catch (error) {
        return res.json({ success: false, message: error.message});
    }
   
}


// check if user authenticated
export const isAuthenticated = async(req, res) => {

    try{
        return res.json({success: true});

    }catch (error) {
        res.json({success: false, message: error.message})
    }
}

// send password to reset OTP

export const sendResetOtp = async(req, res) => {

    const {email} = req.body;

    if(!email){
        return  res.json({ success: false, message: 'Email is required'});
    }
    try {

        const user = await userModel.findOne({email: email.toLowerCase()});
        if(!user) { 
            return res.json({ success: false, message: ' user not found'});
        }

        // / generating OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;

        // expires in 15min
        const expiryMinutes = 15;
        user.resetOtpExpireAt = Date.now() + expiryMinutes * 60 * 1000;

        // user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        // sending OTP to email 
        const mailOption = { 
            from: process.env.SENDER_EMAIL,
            to: user.email, //user-email
            subject: 'Password Reset OTP',
            // text: `your OTP for resetting your password is ${otp}, use this OTP to proceed with resetting password . `
             html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }
        await transporter.sendMail(mailOption);

        res.json({ success:true, message: 'OTP sent to your  Email'})

    } catch (error) {
        res.json({ success: false, message: error.message})
    }

        
  
}


//  reset User password 

export const resetPassword = async (req, res) => {
    console.log('Reset Password Controller Hit!', req.body); 

    const { email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return  res.json({success: false, message: 'email, otp, and new password are required'});
    }

    try{

        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false , message: "user not found!!"});
        }

       

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return  res.json({success: false, message: "invalid OTP"});
        }
        
        
        // expiring at 

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({ success: false, message:"OTP Expired"});
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();
        
        return res.json({success: true, message:'password has been reset successfully'})

    }catch(error) {
        return  res.json({success: false, message: error.message});
    }
}
