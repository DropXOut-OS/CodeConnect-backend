import mongoose, { Schema, model } from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
       type: String,
        text: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    phone:{
        type: Number,
        min: 10,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    
    password: {
        type: String,
        required: true,
        select: false,

    },
    bio: {
        type: String,
        min: 5,
        max: 200,
    },
    dob:{
        type: Date   
    },
    image: {
        type: String, //cloudinary link save here
        required: true
    },
    coverimage: {
        type: String, //cloudinary link save here
    },
    posts:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
    }
    ],
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;