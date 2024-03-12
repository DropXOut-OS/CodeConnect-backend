import mongoose from 'mongoose';
import mongoose, { Schema, model } from 'mongoose';
const chatSchema = new mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
    },
    content:{
        type:String,
        required: true
    },
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
   
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;