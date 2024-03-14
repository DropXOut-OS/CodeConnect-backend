import mongoose, { Schema, model } from 'mongoose';
const commentShema = new mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    content:{
        type:String,
        required: true
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
   
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentShema);
export default Comment;