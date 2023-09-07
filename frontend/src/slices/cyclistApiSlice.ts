import { CYCLISTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const cyclistsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCyclists: builder.query({
      query: (tab) => ({
        url: CYCLISTS_URL,
        method: "GET",
        params: {tab} ,
      }),
      providesTags: ["Cyclist"],
      keepUnusedDataFor: 5
    }),
  }),
});

export const { useGetCyclistsQuery } = cyclistsApiSlice;
