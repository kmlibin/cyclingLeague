import React from 'react'
import { useParams } from 'react-router-dom';
import { useGetSingleTeamQuery, useGetTeamsQuery } from '../slices/cyclistApiSlice';

const TeamScreen = () => {
    const { name } = useParams();
    const {data } = useGetTeamsQuery({})
  //need to decode the names...right now, it's passed as tadej%20Pogacar because spaces are dumb. but i'd rather use rider name than id
  const decodedName = decodeURIComponent(name || "");
    
    const { data: team } = useGetSingleTeamQuery(decodedName);
    console.log(team)
    console.log(data)
  return (
    <div>TeamScreen</div>
  )
}

export default TeamScreen