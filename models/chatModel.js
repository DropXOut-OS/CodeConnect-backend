import mongoose from 'mongoose';
import mongoose, { Schema, model } from 'mongoose';
const chatSchema = new mongoose.Schema({
    
    name:{
        type: String,
        required: true,
    },
    groupChat:{
        type: Boolean,
        default: false
        
    },
    creator:{
        type: Types.ObjectId,
        ref: "User",
    },
    members:[
        {
            type: Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;