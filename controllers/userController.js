import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";




// API Controllers


// 1) Register User
const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password, bio, image, coverimage } = req.body;

    if (!username || !email || !password || !image) {
        return res.status(404).json({
            success: false,
            message: "All fields are required.",
        });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User already registered.",
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        bio,
        image,
        coverimage,
    });
    return res.status(201).json({
        success: true,
        message: "User registered successfully.",
        user,
    });


})
export {
    registerUser
}

