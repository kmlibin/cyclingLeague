import { apiSlice } from "./apiSlice";
import { FANTASY_TEAM_URL } from "../constants";

export const fantasyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //sends request to backend and gets cookie. then when we get data back, we call "set credentials" in authslice
    createTeam: builder.mutation({
      //name and password send in data
      query: (league) => ({
        url: FANTASY_TEAM_URL,
        method: "POST",
        body: league,
      }),
    }),
    getSingleFantasyTeam: builder.query({
      query: (id) => ({
        url: `${FANTASY_TEAM_URL}/${id}`,
        method: "GET",
      }),
      keepUnusedDataFor: 2,
    }),
    getAllFantasyTeams: builder.query({
      query: () => ({
        url: FANTASY_TEAM_URL,
        method: "GET",
      }),
      keepUnusedDataFor: 5,
    }),
    createLeague: builder.mutation({
      query: ({id, leagueDetails}) => ({
        url: `${FANTASY_TEAM_URL}/${id}/myleague`,
        method: "PATCH",
        body: {...leagueDetails},
      }),
    }),
  }),
});

export const { useCreateTeamMutation, useGetSingleFantasyTeamQuery, useGetAllFantasyTeamsQuery, useCreateLeagueMutation } =
  fantasyApiSlice;
