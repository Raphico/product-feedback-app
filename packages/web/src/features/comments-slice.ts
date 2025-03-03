import { createSlice } from "@reduxjs/toolkit";
import type { Comment } from "@/types";
import data from "@/assets/data.json";

type CommentsState = {
  entities: Comment[];
};

const initialState: CommentsState = {
  entities: data.comments,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
});

export const commentsReducer = commentsSlice.reducer;

export default commentsSlice;
