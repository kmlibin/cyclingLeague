import { createSlice } from "@reduxjs/toolkit";
import { Cyclist } from "../interfaces/Cyclist";
import { User } from "../interfaces/User";

type InitialState = {
  sharedRiders: Cyclist[],
  user: string;
};

const storedUserData = localStorage.getItem("sharedRiders");
const parsedUserData = storedUserData ? JSON.parse(storedUserData) : {};

const initialState: InitialState = {
  user: parsedUserData.user || "",
  // if the user doesn't exist in parsedUserData, set sharedRiders to an empty array
  sharedRiders: parsedUserData.sharedRiders || [],
};

const sharedRidersSlice = createSlice({
  name: "sharedRiders",
  initialState,
  reducers: {
    addSharedRiders: (state, action) => {
      const { user, sharedRiders } = action.payload;
      state.user = user;
      state.sharedRiders = sharedRiders;
     
      const userData = { user, sharedRiders };
      localStorage.setItem("sharedRiders", JSON.stringify(userData));
    },
  },
});

export const { addSharedRiders } = sharedRidersSlice.actions;
export default sharedRidersSlice.reducer;
