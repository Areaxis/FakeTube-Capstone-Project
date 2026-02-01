import jwt from "jsonwebtoken";
import { User, Channel, Video } from "../models/app.model.js";

const SECRET = "youtubesecretkey";

/* ================= AUTH ================= */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const user = new User({
      username,
      email,
      password,
      avatar: avatar || "https://i.imgur.com/DefaultAvatar.png"
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1d" });
    res.json({ token, user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1d" });
    res.json({ token, user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
};

/* ================= CHANNELS ================= */
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, avatar, banner } = req.body;

    const channel = new Channel({
      channelName,
      description,
      owner: req.userId,
      avatar,
      banner
    });

    await channel.save();
    res.json(channel);
  } catch {
    res.status(500).json({ message: "Error creating channel" });
  }
};

export const getChannel = async (req, res) => {
  const channel = await Channel.findById(req.params.id).populate("owner", "username avatar");
  res.json(channel);
};

export const getAllChannels = async (req, res) => {
  const channels = await Channel.find().populate("owner", "username avatar");
  res.json(channels);
};

/* ================= VIDEO ================= */
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, category, videoUrl, thumbnailUrl, channel } = req.body;

    const video = new Video({
      title,
      description,
      category,
      videoUrl,
      thumbnailUrl,
      channel
    });

    await video.save();
    res.json(video);
  } catch {
    res.status(500).json({ message: "Upload failed" });
  }
};

export const getAllVideos = async (req, res) => {
  const { category, channel, search } = req.query;
  let filter = {};

  if (category) filter.category = category;
  if (channel) filter.channel = channel;
  if (search) filter.title = { $regex: search, $options: "i" };

  const videos = await Video.find(filter).populate("channel", "channelName avatar");
  res.json(videos);
};

export const getVideoById = async (req, res) => {
  const video = await Video.findById(req.params.id).populate("channel", "channelName avatar");
  res.json(video);
};

export const updateVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });

  const { title, description, category, thumbnailUrl } = req.body;

  if (title) video.title = title;
  if (description) video.description = description;
  if (category) video.category = category;
  if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;

  await video.save();
  res.json(video);
};

export const deleteVideo = async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ message: "Video deleted" });
};

/* ================= LIKE / DISLIKE ================= */
export const likeVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  const userId = req.userId.toString();

  const liked = video.likes.some(id => id.toString() === userId);
  if (!liked) {
    video.likes.push(userId);
    video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
  } else {
    video.likes = video.likes.filter(id => id.toString() !== userId);
  }

  await video.save();
  res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
};

export const dislikeVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);
  const userId = req.userId.toString();

  const disliked = video.dislikes.some(id => id.toString() === userId);
  if (!disliked) {
    video.dislikes.push(userId);
    video.likes = video.likes.filter(id => id.toString() !== userId);
  } else {
    video.dislikes = video.dislikes.filter(id => id.toString() !== userId);
  }

  await video.save();
  res.json({ likes: video.likes.length, dislikes: video.dislikes.length });
};

/* ================= COMMENTS ================= */
export const addComment = async (req, res) => {
  const video = await Video.findById(req.params.videoId);
  video.comments.push({ user: req.userId, text: req.body.text });
  await video.save();
  const populated = await Video.findById(video._id).populate("comments.user", "username avatar");
  res.json(populated.comments);
};

export const getCommentsByVideo = async (req, res) => {
  const video = await Video.findById(req.params.videoId).populate("comments.user", "username avatar");
  res.json(video.comments);
};

export const updateComment = async (req, res) => {
  const video = await Video.findOne({ "comments._id": req.params.id });
  const comment = video.comments.id(req.params.id);
  if (comment.user.toString() !== req.userId) return res.status(403).json({ message: "Unauthorized" });

  comment.text = req.body.text;
  await video.save();
  res.json(video.comments);
};

export const deleteComment = async (req, res) => {
  const video = await Video.findOne({ "comments._id": req.params.id });
  const comment = video.comments.id(req.params.id);
  if (comment.user.toString() !== req.userId) return res.status(403).json({ message: "Unauthorized" });

  comment.deleteOne();
  await video.save();
  res.json(video.comments);
};
