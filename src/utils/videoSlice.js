import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

/* ================= FETCH VIDEOS WITH FILTERS ================= */
export const fetchVideos = createAsyncThunk(
  "videos/fetchAll",
  async ({ category = "", search = "" }) => {
    const params = new URLSearchParams();

    if (category) params.append("category", category);
    if (search) params.append("search", search);

    const res = await api.get(`/videos?${params.toString()}`);
    return res.data;
  }
);

/* ================= FETCH SINGLE VIDEO ================= */
export const fetchVideoById = createAsyncThunk(
  "videos/fetchOne",
  async (id) => {
    const res = await api.get(`/videos/${id}`);
    return res.data;
  }
);

/* ================= LIKE VIDEO ================= */
export const likeVideo = createAsyncThunk(
  "videos/like",
  async (id) => {
    const res = await api.put(`/videos/${id}/like`);
    return res.data;
  }
);

/* ================= DISLIKE VIDEO ================= */
export const dislikeVideo = createAsyncThunk(
  "videos/dislike",
  async (id) => {
    const res = await api.put(`/videos/${id}/dislike`);
    return res.data;
  }
);

const videoSlice = createSlice({
  name: "videos",
  initialState: {
    videos: [],
    currentVideo: null,
    loading: false
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.loading = false;
        state.videos = action.payload;
      })
      .addCase(fetchVideoById.fulfilled, (state, action) => {
        state.currentVideo = action.payload;
      })
      .addCase(likeVideo.fulfilled, (state, action) => {
        if (state.currentVideo) {
          state.currentVideo.likes = Array(action.payload.likes).fill("x");
          state.currentVideo.dislikes = Array(action.payload.dislikes).fill("x");
        }
      })
      .addCase(dislikeVideo.fulfilled, (state, action) => {
        if (state.currentVideo) {
          state.currentVideo.likes = Array(action.payload.likes).fill("x");
          state.currentVideo.dislikes = Array(action.payload.dislikes).fill("x");
        }
      });
  }
});

export default videoSlice.reducer;
