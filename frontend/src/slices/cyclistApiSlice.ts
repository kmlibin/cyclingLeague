import { CYCLISTS_URL, TEAMS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const cyclistsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCyclists: builder.query({
      query: ({ tab, keyword }) => ({
        url: CYCLISTS_URL,
        method: "GET",
        params: { tab, keyword },
      }),
      providesTags: ["Cyclist"],
      keepUnusedDataFor: 5,
    }),
    getSingleCyclist: builder.query({
      query: (cyclistName) => ({
        url: `${CYCLISTS_URL}/${cyclistName}`,
      }),
      keepUnusedDataFor: 2,
    }),
    getTeams: builder.query({
      query: ({ pageNumber }) => ({
        url: TEAMS_URL,
        method: "GET",
        params: { pageNumber },
      }),
      keepUnusedDataFor: 5,
    }),
    getSingleTeam: builder.query({
      query: (teamName) => ({
        url: `${TEAMS_URL}/${teamName}`,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetCyclistsQuery,
  useGetSingleCyclistQuery,
  useGetTeamsQuery,
  useGetSingleTeamQuery,
} = cyclistsApiSlice;
