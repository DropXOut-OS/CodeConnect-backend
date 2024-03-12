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

  if ((!email && !username)|| !password) {
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
    throw new apiError(400, "email username or password is not correct");
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
})


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
    return res.status(200).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "User account deleted successfully.",
    });

})

export {
    registerUser,
    loginUser,
    logoutUser,
    deleteAccount,
}
export { registerUser, loginUser, logoutUser };
