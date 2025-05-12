import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

import "dotenv/config";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '15d',
    });
};

router.post('/register', async (req, res) => {
    try{
        const {email, username, password} = req.body;

        if(!email || !username || !password){
            return res.status(400).json({message: "Please fill all fields"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }

        if(username.length < 3){
            return res.status(400).json({message: "Username must be at least 3 characters"});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({message: "Email already exists"});
        }

        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({message: "Username already exists"});
        }

        const profilePicture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;	 

        const newUser = new User({
            email,
            username,
            password,
            profilePicture
        });

        await newUser.save();


        const token = generateToken(newUser._id);

        res.status(201).json({
            token, 
            newUser:{
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
                createdAt: newUser.createdAt,
            }
        });


    }
    catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({message: "Internal server error"});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Please fill all fields"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt,
            }
        });
        
    } catch (error) {
        console.log("Error during login:", error);
        res.status(500).json({message: "Internal server error"});
    }
});


export default router;