const express = require('express');
const router=express.Router();
const cors=require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
router.use(cors());
//applying cors property it allows server to indicate any cross origins 
//I had given the below code to restrict the cors error in the frontend side
router.use(
    cors({
        origin: "https://login-assign.onrender.com",
        methods: "POST",
    })
)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'maximus.goyette68@ethereal.email',
        pass: 'gpJZtPeC9JyRMR7M8c'
    }
});
require('../db/conn');
const User = require('../models/userSchema');


//Implementation of Register route 
router.post('/register', async (req, res) => {
    const {email,password} = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Something is missing" });
    }
    try {
        //Here we check the given email is exist or not already
        const userExist = await User.findOne({ email: email });
        //condition for checking existing user 
        if (userExist) {
            return res.status(422).json({ error: "Already Registered" });
        }
       //for new user this will work
        const user = new User({email,password});
        const userRegister = await user.save();
        if (userRegister) {
            res.status(201).json({ message: "user Successfully Registered" });
            res.send(userRegister);
        }
        else {
            res.status(500).json({ error: "failed register" });
        }
    }
    //we catch the error here
    catch (error) {
        console.log(error);
    }
});
  //Implementation of Signin section 
    router.post('/signin', async (req, res) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: "Please fill the data" });
            }
            const UserLogin = await User.findOne({ email: email });
            //Here We check Whether the User has Correct Email or not
            if (UserLogin) {
                const isMatch = await bcrypt.compare(password, UserLogin.password);
                if (isMatch) {
                    res.json({ message: "User signin Successfully" });
                }
                //when the email or password does not match 
                else {
                    res.status(400).json({ message: "fail to login" });
                }
            }
            //Error while the Email not Matches
            // else {
            //     res.status(400).json({ error: "Invalid Credentials" });
            // }
        }
        //It Shows the Error while the Server Runs
        catch (error) {
            console.log(error);
        }
});

//to implement to check whether email exist or not
router.post('/login',async (req,res)=>{
    const {email} =req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
          const mailOptions = {
            from: 'maximus.goyette68@ethereal.email',
            to: email,
            subject: 'Please register to Login',
            text: 'Please Create your account by clicking on the link below:'
          };
          // Send the verification email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending verification email:', error);
              return res.status(500).json({ error: 'Failed to send verification email' });
            }
            console.log('Verification email sent:', info.response);
          });
          return res.status(400).json({ error: 'Email not found' });
        }
            // Create the email content
        // Email is correct, send a success response
        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ error: 'Server error' });
      }
})
module.exports=router;