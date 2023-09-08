import { CYCLISTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const cyclistsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCyclists: builder.query({
      query: ({tab, keyword}) => ({
        url: CYCLISTS_URL,
        method: "GET",
        params: {tab, keyword},
      }),
      providesTags: ["Cyclist"],
      keepUnusedDataFor: 5
    }),
    getSingleCyclist: builder.query({
      query: (cyclistName) => ({
        url: `${CYCLISTS_URL}/${cyclistName}`
      }),
      keepUnusedDataFor: 2
    })
  }),
 
});

export const { useGetCyclistsQuery, useGetSingleCyclistQuery } = cyclistsApiSlice;
