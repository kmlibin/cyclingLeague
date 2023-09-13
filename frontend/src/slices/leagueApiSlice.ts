import { apiSlice } from './apiSlice'
import { LEAGUE_URL } from '../constants';

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      //sends request to backend and gets cookie. then when we get data back, we call "set credentials" in authslice
      createLeague: builder.mutation({
        //name and password send in data
        query: (league) => ({
          url: LEAGUE_URL,
          method: "POST",
          body: {...league},
        }),
      }),
    }),
  });
  
  export const {
    useCreateLeagueMutation
  } = usersApiSlice;