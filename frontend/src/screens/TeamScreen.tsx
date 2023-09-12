import React from 'react'
import { useParams } from 'react-router-dom';
import { useGetSingleTeamQuery, useGetTeamsQuery } from '../slices/cyclistApiSlice';
import CyclistData from '../components/CyclistData';
import { Cyclist } from '../interfaces/Cyclist';

const TeamScreen = () => {
    const { name } = useParams();
  //need to decode the names...right now, it's passed as tadej%20Pogacar because spaces are dumb. but i'd rather use rider name than id
  const decodedName = decodeURIComponent(name || "");
    
    const { data: team } = useGetSingleTeamQuery(decodedName);
    console.log(team?.cyclists)
  
  return (
    <>
    {team?.cyclists?.map((rider: Cyclist) => (
        <CyclistData key={rider._id} cyclistData={rider} /> // Return the component here
    ))}
</>
  )
}


export default TeamScreen