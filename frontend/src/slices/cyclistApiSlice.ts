import { CYCLISTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const cyclistsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCyclists: builder.query({
      query: () => ({
        url: CYCLISTS_URL,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCyclistsQuery } = cyclistsApiSlice;
