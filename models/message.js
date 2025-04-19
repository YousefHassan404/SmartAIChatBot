import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  recipientId: {
    type: String,
  },
  messageType: {
    type: String,
    enum: ["text", "postback"],
    required: true,
  },
  messageText: {
    type: String,
  },
  postbackPayload: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Message", messageSchema);
