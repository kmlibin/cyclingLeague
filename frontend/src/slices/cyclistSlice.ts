import { createSlice } from "@reduxjs/toolkit";
import { Cyclist } from "../interfaces/Cyclist";

type InitialState = {
    sharedRiders: Cyclist[];
  };


  const storedCyclists = localStorage.getItem("sharedCyclists");

  const initialState: InitialState = {
    sharedRiders: storedCyclists ? JSON.parse(storedCyclists) : []
  }

const sharedRidersSlice = createSlice({
  name: "sharedRiders",
  initialState,
  reducers: {
    addSharedRiders: (state, action) => {
      state.sharedRiders = action.payload;
      localStorage.setItem("sharedCyclists", JSON.stringify(action.payload))
    },
  },
});

export const { addSharedRiders} = sharedRidersSlice.actions;
export default sharedRidersSlice.reducer;