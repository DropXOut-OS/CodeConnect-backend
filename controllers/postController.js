import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";


const createPost = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

if (!title || !description) {
  throw new ApiError(400, "All fields (title and description) are required");
}
if (!req.files) {
  throw new ApiError(400, "Image is required. Please upload an image file.");
}

const postImageLocalPath = req.files?.image[0]?.path;

if (!postImageLocalPath) {
  throw new ApiError(400, "Image path is required. Please ensure a valid image file is uploaded.");
}


console.log("Image path:", postImageLocalPath);
    
    const image = await uploadCloudinary(postImageLocalPath);
  
   const loggedinUser = req.user;

   if(!loggedinUser){
    throw new ApiError(401, "please login first, to create a post");
   };
    const post = await Post.create({
        title,
        creator: req.user.id,
        description,
        image: image.url
    })
    let user = await User.findOne({_id: req.user.id});
    user.posts.push(post._id);
    await user.save();
    return res.status(201).json(new ApiResponse(201, post, "Post created successfully"))
})
export {createPost}