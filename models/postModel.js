import mongoose, {Schema, model } from "mongoose"

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creator:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    likes:{
        type: Number,
        default: 0
    },
    likeBy:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    commentCount:{
        type: Number,
        default: 0
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})
const post = mongoose.model("Post", postSchema)
export default post

















