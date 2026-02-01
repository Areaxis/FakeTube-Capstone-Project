import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import createRoutes from "./routes/app.routes.js";

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* ================= DATABASE ================= */
mongoose.connect("mongodb://127.0.0.1:27017/youtube_clone")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= ROOT ROUTE ================= */
app.get("/", (req, res) => res.send("API running"));

/* ================= ROUTES ================= */
// No multer anymore — routes handle URL strings only
app.use("/api/auth", createRoutes());

/* ================= SERVER ================= */
app.listen(5000, () => console.log("Server running on port 5000"));
