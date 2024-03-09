import mongoose, { Schema, model } from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    content: String,
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    Chat: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
