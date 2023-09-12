//to set user credentials to local storage (and remove)

import { createSlice } from "@reduxjs/toolkit";

type IntialState = {
  userInfo: string;
};

const storedUserInfo = localStorage.getItem("userInfo");

const initialState: IntialState = {
  userInfo: storedUserInfo ? JSON.parse(storedUserInfo) : "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //call when we get cookie back. we store the user info in local storage , NOT token
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = " ";
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
