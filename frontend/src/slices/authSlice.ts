//to set user credentials to local storage (and remove)

import { createSlice } from "@reduxjs/toolkit";

type UserInfo = {
  name: string;
  email: string;
  _id: string;
  isAdmin: boolean;
  fantasyTeam: {
    cyclists: string[];
    teamName: string;
  };
};
//was having an issue with the logout function. initially i had the type of initial state  as what userInfo is now. but when id logout,
//it would remove the cookie, but it would set uservalues to empty strings (which i imagine caused an issue because it evaluated to truthy), 
//and my login screen redirects to home if userInfo exists!
type InitialState = {
  userInfo: UserInfo | string;
};

const storedUserInfo = localStorage.getItem("userInfo");

const initialState: InitialState = {
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
    updateTeam: (state, action) => {
      if (typeof state.userInfo === "object") {
        state.userInfo.fantasyTeam = action.payload;
      }
    },
    logout: (state, action) => {
      state.userInfo = "";
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout, updateTeam } = authSlice.actions;
export default authSlice.reducer;
