import mongoose from "mongoose";

/* ================= USER ================= */
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,

  // Avatar is now a URL
  avatar: {
    type: String,
    default: "https://i.imgur.com/DefaultAvatar.png"
  }
}, { timestamps: true });


/* ================= CHANNEL ================= */
const channelSchema = new mongoose.Schema({
  channelName: String,
  description: String,

  // Both are URLs now
  avatar: { type: String, default: "" },
  banner: { type: String, default: "" },

  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subscribers: { type: Number, default: 0 }

}, { timestamps: true });


/* ================= COMMENT ================= */
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  createdAt: { type: Date, default: Date.now }
});


/* ================= VIDEO ================= */
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,

  // URLs instead of file paths
  videoUrl: String,
  thumbnailUrl: String,

  channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema]

}, { timestamps: true });


export const User = mongoose.model("User", userSchema);
export const Channel = mongoose.model("Channel", channelSchema);
export const Video = mongoose.model("Video", videoSchema);
