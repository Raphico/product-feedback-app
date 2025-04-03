import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types";
import userApi from "./service";

type UserState = {
  data: User | null;
};

const initialState: UserState = {
  data: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.data = action.payload;
    },
    clearUser(state) {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        state.data = action.payload;
      },
    );
    builder.addMatcher(userApi.endpoints.getMe.matchRejected, (state) => {
      state.data = null;
    });
  },
});

export const userReducer = userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;

export default userSlice;
