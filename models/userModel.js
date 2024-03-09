import mongoose, { Schema, model } from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true,
        lowercase: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
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
    image: {
        type: String, //cloudinary link save here
        required: true
    },
    coverimage: {
        type: String, //cloudinary link save here
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;