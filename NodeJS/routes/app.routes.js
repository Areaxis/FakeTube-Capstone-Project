import express from "express";
import jwt from "jsonwebtoken";

import {
  registerUser, loginUser, getMe,
  createChannel, getChannel, getAllChannels,
  uploadVideo,
  getAllVideos, getVideoById, updateVideo, deleteVideo,
  likeVideo, dislikeVideo,
  addComment, getCommentsByVideo, updateComment, deleteComment
} from "../controllers/app.controller.js";

import { Channel } from "../models/app.model.js";

/*
  This file exports a FUNCTION, not a router directly.
*/
export default function createRoutes() {
  const router = express.Router();
  const SECRET = "youtubesecretkey";

  /* ================= VERIFY TOKEN ================= */
  function verifyToken(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];

    try {
      const decoded = jwt.verify(token, SECRET);
      req.userId = decoded.id;
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  }

  /* ================= AUTH ================= */

  // Register user (avatar is now a URL string)
  router.post("/register", registerUser);

  router.post("/login", loginUser);
  router.get("/me", verifyToken, getMe);


  /* ================= CHANNELS ================= */

  // Create channel (avatar and banner are URL strings)
  router.post("/channels", verifyToken, createChannel);

  router.get("/channels", getAllChannels);
  router.get("/channels/:id", getChannel);

  router.get("/my-channels", verifyToken, async (req, res) => {
    try {
      const channels = await Channel.find({ owner: req.userId });
      res.json(channels);
    } catch {
      res.status(500).json({ message: "Error fetching your channels" });
    }
  });


  /* ================= VIDEOS ================= */

  // Upload video using videoUrl + thumbnailUrl
  router.post("/videos", verifyToken, uploadVideo);

  router.get("/videos", getAllVideos);
  router.get("/videos/:id", getVideoById);

  router.put("/videos/:id", verifyToken, updateVideo);
  router.delete("/videos/:id", verifyToken, deleteVideo);


  /* ================= LIKE / DISLIKE ================= */

  router.put("/videos/:id/like", verifyToken, likeVideo);
  router.put("/videos/:id/dislike", verifyToken, dislikeVideo);


  /* ================= COMMENTS ================= */

  router.post("/videos/:videoId/comments", verifyToken, addComment);
  router.get("/videos/:videoId/comments", getCommentsByVideo);
  router.put("/comments/:id", verifyToken, updateComment);
  router.delete("/comments/:id", verifyToken, deleteComment);

  return router;
}
