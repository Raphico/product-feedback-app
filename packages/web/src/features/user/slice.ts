import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./types";
import userApi from "./service";

type AuthState = {
  user: User | null;
};

const initialState: AuthState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.getMe.matchFulfilled,
      (state, action) => {
        state.user = action.payload;
      },
    );
    builder.addMatcher(userApi.endpoints.getMe.matchRejected, (state) => {
      state.user = null;
    });
  },
});

export const userReducer = userSlice.reducer;
export const { setUser, clearUser } = userSlice.actions;

export default userSlice;
