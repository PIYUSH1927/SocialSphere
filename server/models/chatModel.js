import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexing for faster queries
ChatSchema.index({ members: 1 });

const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel;
