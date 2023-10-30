import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

//slices
import { apiSlice } from "./slices/apiSlice";
import authSliceReducer from "./slices/authSlice";
import sharedRidersSliceReducer from "./slices/cyclistSlice";

const store = configureStore({
  reducer: {
    //don't have to bring other api reducers in because we are using apiSlice.inject endpoints
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducer,
    sharedRiders: sharedRidersSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
