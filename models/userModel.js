import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    
    username:{
        type: String,
        required: true,
        index: true,
        lowercase: true,
        trim: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        trim: true
    },
    password:{
        type: String,
        required: [true, "password is is required"],
    },
    bio:{
        type: String,
        min: [5, "minimum 5 character required"],
        max: [200, "maximum"]
    },
    image:{
        type: String, //cloudinary link save here
        required: true
    },
    coverimage:{
        type: String, //cloudinary link save here
    },
    accessToken:{
        type: String,
    }
    


}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;