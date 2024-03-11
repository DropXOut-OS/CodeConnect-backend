import mongoose, {Schema, model } from "mongoose"

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    creater:{
        type: mongoose.Schema.Types.ObjectId
    },
    postImage:{
        type: string,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
})
const post = mongoose.model("Post", postSchema)
export default post

















