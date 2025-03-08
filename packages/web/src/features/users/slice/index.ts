import { createSlice } from "@reduxjs/toolkit";
import data from "@/assets/data.json";
import { User } from "../types";

type UsersState = {
  entities: User[];
};

const initialState: UsersState = {
  entities: data.users,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export const usersReducer = usersSlice.reducer;

export default usersSlice;
