import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Title stream can not be empty"],
  },
});

const ChatSession =
  mongoose.models.ChatSession || mongoose.model("ChatSession", sessionSchema);

export default ChatSession;
