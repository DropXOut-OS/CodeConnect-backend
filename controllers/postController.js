import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import Post from "../models/postModel.js";

const createPost = asyncHandler(async (req, res) => {
    const { title, description} = req.body;
    if (!title || !description) {
        throw new ApiError(400, "All field are Required");
    }
    const postImageLocalPath = req.files?.image[0]?.path;
    if (!postImageLocalPath) {
        throw new ApiError(400, "image path is required");
    }
    
    const postImage = await uploadCloudinary(postImageLocalPath);
    if(!postImage){
        throw new ApiError(400, "image is required");
    }
    const post = await Post.create({
        title,
        creater: req.user._id,
        description,
        postImage
    })
})
export {createPost}