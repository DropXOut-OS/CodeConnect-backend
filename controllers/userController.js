import User from "../models/userModel.js";
import bcrypt from 'bcrypt';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

// API Controllers
// 1) Register User
const registerUser = asyncHandler(async (req, res) => {

    const { username, email, password, bio } = req.body;

    if (!username || !email || !password ) {
        throw new ApiError(400, "All field are Required")
    }
    const existingUser = await User.findOne({
            $or:[{username}, {email}]
    });
    if (existingUser) {
        throw new ApiError(400, "User Already exists")
    }
    console.log(req.files)
     const imageLocalPath = req.files?.image[0]?.path;
     const coverimageLocalPath = (req.files?.coverimage && req.files?.coverimage[0]?.path) || "";
  
     if(!imageLocalPath){
        throw new ApiError(400, "Image path is required")
    }

    const image = await uploadCloudinary(imageLocalPath)
    const coverimage = await uploadCloudinary(coverimageLocalPath)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    if(!image){
        throw new ApiError(400, "image is required")
    }
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        bio,
        image: image.url,
        coverimage: coverimage?.url || "",
    });

    const createdUser = await User.findOne(user._id)

    if(!createdUser){
    throw new ApiError(500, "something went wrong while registering the user")
    }
    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully."));


})

// 2) Login User
const loginUser = asyncHandler(async (req, res) => {

});











export {
    registerUser
}

