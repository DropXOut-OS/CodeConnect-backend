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
    throw new ApiError(
      400,
      "Image path is required. Please ensure a valid image file is uploaded."
    );
  }
  console.log("Image path:", postImageLocalPath);
  const image = await uploadCloudinary(postImageLocalPath);
  const loggedinUser = req.user;
  if (!loggedinUser) {
    throw new ApiError(401, "please login first, to create a post");
  }
  const post = await Post.create({
    title,
    creator: req.user.id,
    description,
    image: image.url,
  });
  let user = await User.findOne({ _id: req.user.id });
  user.posts.push(post._id);
  await user.save();
  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { description, title } = req.body;

  if (!(description || title)) {
    throw new ApiError(400, "All fields are required");
  }
  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  if (post.creator.toString() !== req.user.id) {
    throw new ApiError(401, "Unauthorized");
  }
  const deletedPost = await Post.updateOne(
    { _id: id },
    {
      $set: {
        title,
        description,
      },
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, deletedPost, "Post updated successfully"));
});
const updatePostImage = asyncHandler(async (req, res) => {
  const id = req.params;
  console.log(id);
  const imageLocalPath = req.file?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image path is required");
  }
  const image = await uploadCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(400, "image is required");
  }
  const post = await Post.findByIdAndUpdate(id, {
    image: image.url,
  });
  if (!post) {
    throw new ApiError(
      500,
      "something went wrong while updating the post image"
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, post, "post image updated successfully."));
});
const postLike = asyncHandler(async (req, res) => {
    const _id = req.params;
    const id = req.user.id
    const post = await Post.findOne(_id)
    
    if (!post) {
      throw new ApiError(404, "Post not found");
    }
    if (post.likeBy.includes(id)) {
      post.likeBy.pull(id)
      post.likes = post.likeBy.length
      res.status(200).json(new ApiResponse(200, "unliked successfully"));
   
    } else {
      post.likeBy.push(id)
      post.likes = post.likeBy.length   
      res.status(200).json(new ApiResponse(200, "liked successfully"));
    }
    await post.save()
    return res.status(200).json(new ApiResponse(200, "successfully"));
});
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }
  if (post.creator.toString() !== req.user.id) {
    throw new ApiError(401, "Unauthorized");
  }
  const deletedPost = await Post.deleteOne({ _id: id });
  return res
    .status(200)
    .json(new ApiResponse(200, deletedPost, "Post deleted successfully"));
});
const fetchAllPosts = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const posts = await Post.find()
    .populate({ path: "creator", select: "-bio -posts -coverimage" })
    .populate({
      path: "comments",
      populate: {
        path: "creator", select: "-bio -posts -email -coverimage",
      },
    });
  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});
const fetchPostByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;

  const userPost = await User.findOne({username})
    .populate("posts")
    .select("-bio -coverimage");
  if (!userPost) {
    throw new ApiError(404, "user not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userPost, "Posts fetched successfully"));
});
const fetchPostByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userPost = await User.findById({_id: id})
    .populate("posts")
    .select("-bio -coverimage");
  if (!userPost) {
    throw new ApiError(404, "user not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, userPost, "Posts fetched successfully"));
});

export {
  createPost,
  updatePost,
  deletePost,
  fetchAllPosts,
  fetchPostByUsername,
  updatePostImage,
  fetchPostByUserId,
  postLike
};
