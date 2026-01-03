import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatSession",
    required: true,
  },
  role: {
    type: String,
    required: [true, "Role stream can not be empty."],
    enum: ["user", "assistant", "system"],
  },
  content: {
    type: String,
    required: [true, "Content strem can not be empty."],
  },
});

const Chats = mongoose.models.Chats || mongoose.model("Chats", chatSchema);

export default Chats;
