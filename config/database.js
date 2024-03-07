import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log('MongoDB is connected successfully.');
    } catch (error) {
        console.log('Unable to connect MongoDb.', error);
        process.exit(1);
    }
}

export default connectDB;