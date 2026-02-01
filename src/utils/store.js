import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import videoReducer from "./videoSlice";
import commentReducer from "./commentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    videos: videoReducer,
    comments: commentReducer
  }
});
