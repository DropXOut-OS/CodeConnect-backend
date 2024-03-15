import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadCloudinary } from "../utils/cloudinary.js";

// API Controllers
// 1) Register User
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, bio } = req.body;

    if (!username || !email || !password) {
        throw new ApiError(400, "All field are Required");
    }
    const existingUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existingUser) {
        throw new ApiError(400, "User Already exists");
    }
    console.log(req.files);
    const imageLocalPath = req.files?.image[0]?.path;
    const coverimageLocalPath =
        (req.files?.coverimage && req.files?.coverimage[0]?.path) || "";

    if (!imageLocalPath) {
        throw new ApiError(400, "Image path is required");
    }

    const image = await uploadCloudinary(imageLocalPath);
    const coverimage = await uploadCloudinary(coverimageLocalPath);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!image) {
        throw new ApiError(400, "image is required");
    }
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        bio,
        image: image.url,
        coverimage: coverimage?.url || "",
    });

    const createdUser = await User.findOne(user._id);

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user");
    }
    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User registered successfully."));
});
// 2) Login User
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }],
    }).select("+password");
    if (!user) {
        throw new ApiError(404, "email username or password is not correct");
    }

    const passwordMatched = await bcrypt.compare(password, user.password);
    if (!passwordMatched) {
        throw new ApiError(400, "email username or password is not correct");
    }

    // This will act as util function.
    // Jwt token for browser
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    const { password: pass, ...userInfo } = user._doc;

    return res
        .status(200)
        .cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
        .json(new ApiResponse(200, userInfo, "welcome back. login successfull"));
});
// 3) Logout User
const logoutUser = asyncHandler(async (req, res) => {
    res.clearCookie("token");
    return res
        .status(200)
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })

        .json(new ApiResponse(200, null, "User logged out successfully."));
});
const updateProfileImage = asyncHandler(async (req, res) => {
    const id = req.user.id;
    console.log(id)
    const imageLocalPath = req.file?.path;
    if (!imageLocalPath) {
        throw new ApiError(400, "Image path is required");
    }
    const image = await uploadCloudinary(imageLocalPath);
    if (!image) {
        throw new ApiError(400, "image is required");
    }
    const user = await User.findByIdAndUpdate(id, {
        image: image.url,
    });
    if (!user) {
        throw new ApiError(500, "something went wrong while updating the user");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, user, "Profile image updated successfully."));
});
const updateCoverImage = asyncHandler(async (req, res) => {
    const { id } = req.user.id;
    const coverImageLocalPath = req.file?.path;
    if (!coverImageLocalPath) {
        throw new ApiError(400, "Image path is required");
    }
    const image = await uploadCloudinary(coverImageLocalPath);
    if (!image) {
        throw new ApiError(400, "image is required");
    }
    const user = await User.findByIdAndUpdate(id, {
        coverimage: image.url,
    });
    console.log(user)
    return res
        .status(200)
        .json(new ApiResponse(200, user, "cover image updated successfully."));
});
// 4) Delete Account
const deleteAccount = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({
            success: false,
            message: "Please Login first.",
        });
    }

    if (id !== req.user.id) {
        return res.status(404).json({
            success: false,
            message: "You can delete your own account.",
        });
    }

    const user = await User.findByIdAndDelete(id);
    return res
        .status(200)
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "User account deleted successfully.",
        });
});


// 5) Reset Password

const resetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(404).json({
            success: false,
            message: "Email is required.",
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not Found.",
        });
    }


    const uniqueToken = crypto.randomBytes(30).toString('hex');
    user.resetToken = uniqueToken;



    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'xyz@gmail.com', // replace with your email
            pass: 'xyz' // replace with your password
        }
    });


    // Send password reset email
    const mailOptions = {
        from: 'xyz@gmail.com', // replace with your email
        to: email,
        subject: 'Password Reset',
        text: `You are receiving this email because you have requested the reset of the password for your account.\n\n`
            + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
            + `http://localhost:5173/reset-password/${uniqueToken}\n\n`
            + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };


    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to send reset email' });
        }
        console.log('Email sent: ' + info.response);
        res.json({ message: 'Reset email sent successfully' });
    });

})


// 6) Google OAuth
const googleOAuth = asyncHandler(async (req, res) => {

    const { name, email, photo } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: pass, ...userInfo } = user._doc;

        return res.status(200).cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 2 * 60 * 1000),
        }).json({
            success: true,
            message: "User loggedIn with Google",
            userInfo,
        })
    }
    else {
        const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4); // 12 string pwd
        const hashedPassword = await bcrypt.hash(generatePassword, 10);

        const user = await User.create({
            username: name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
            email: email,
            password: hashedPassword,
            image: photo
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const { password: pass, ...userInfo } = user._doc;

        return res.status(200).cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 2 * 60 * 1000),
        }).json({
            success: true,
            message: "User registered with Google",
            userInfo,
        })
    }
})






export {
    registerUser,
    loginUser,
    logoutUser,
    deleteAccount,
    updateProfileImage,
    updateCoverImage,
    resetPassword,
    googleOAuth
};



