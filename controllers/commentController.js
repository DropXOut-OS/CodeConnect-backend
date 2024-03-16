import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// Create Commeent
const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const id = req.user.id;
    if (!id) {
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
    post.commentCount = post.comments.length
    await post.save();
    return res
        .status(201)
        .json(new ApiResponse(201, comment, "comment created successful"));
});



// Update Comment
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { id } = req.user;
    const { content } = req.body;

    console.log(commentId)


    if (!commentId) {
        throw new ApiError(404, "Comment not found.");
    }

    if (!content) {
        throw new ApiError(404, "All fields are required");
    }

    const comment = await Comment.findById(commentId);
    console.log(comment);

    if (comment.creator.toString() !== id) {
        throw new ApiError(401, "Unautorized");
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        { _id: commentId },
        {
            $set: {
                content
            }
        },
        { new: true },
    );

    updatedComment.save();

    return res
        .status(202)
        .json(new ApiResponse(202, updatedComment, "comment updated successful"));

});






/******88****************************** */
// Delete Comment 
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const id = req.user.id

    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "comment not found")
    }
    if (comment.creator.toString() !== id) {
        throw new ApiError(401, "you are not create this comment")
    }
    const deletedCommment = await comment.deleteOne({ _id: commentId })

    return res.status(200).json(new ApiResponse(200, deletedCommment, "deleted successful"))

});


export { createComment, updateComment, deleteComment };
