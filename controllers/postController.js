import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import Post from "../models/postModel.js";

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
  
   console.log(req.user)
    const post = await Post.create({
        title,
        creator: req.user.id,
        description,
        image: image.url
    })
    return res.status(201).json(new ApiResponse(201, post, "Post created successfully"))
})
export {createPost}