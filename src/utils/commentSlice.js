import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const fetchComments = createAsyncThunk(
  "comments/fetch",
  async (videoId) => {
    const res = await api.get(`/videos/${videoId}/comments`);
    return res.data;
  }
);

export const addComment = createAsyncThunk(
  "comments/add",
  async ({ videoId, text }) => {
    const res = await api.post(`/videos/${videoId}/comments`, { text });
    return res.data;
  }
);

export const updateComment = createAsyncThunk(
  "comments/update",
  async ({ id, text }) => {
    const res = await api.put(`/comments/${id}`, { text });
    return res.data;
  }
);

export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (id) => {
    const res = await api.delete(`/comments/${id}`);
    return res.data;
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: { comments: [] },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = action.payload;
      });
  }
});

export default commentSlice.reducer;
