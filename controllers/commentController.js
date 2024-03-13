import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const id = req.user.id;
  if(!id){
    throw new ApiError(401, "unauthorized")
  }
  if (!postId) {
    throw new ApiError(404, "post not found");
  }
  if (!content) {
    throw new ApiError(400, "all fields are required");
  }
  const comment = await Comment.create({
    creator: id,
    postId: postId,
    content,
  });
  const post = await Post.findOne({ _id: postId });
  post.comments.push(comment._id);
  await post.save();
  return res
    .status(201)
    .json(new ApiResponse(201, comment, "comment created successful"));
});

export { createComment };
