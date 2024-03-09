import mongoose, { Schema, model } from "mongoose";
const requestSchema = new mongoose.Schema(
  {
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    Chat: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Message", requestSchema);
export default Message;
