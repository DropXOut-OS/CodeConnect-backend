import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
// create a userModel
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;