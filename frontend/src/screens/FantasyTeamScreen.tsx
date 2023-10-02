import React from 'react'
import { useParams } from 'react-router-dom';
import { useGetSingleFantasyTeamQuery } from '../slices/fantasyTeamApiSlice';
import CyclistData from '../components/CyclistData';
import { Cyclist } from '../interfaces/Cyclist';
import { useAppSelector } from '../hooks/hooks';

const FantasyTeamScreen = () => {
    const { id } = useParams();
    const userInfo = useAppSelector((state) => state.auth)
console.log(id)
const userId = (typeof userInfo === 'object') ? userInfo._id : null


    const { data: team } = useGetSingleFantasyTeamQuery(id);
    console.log(team)
  
  return (
    <>
    {team?.map((rider: Cyclist) => (
        <CyclistData key={rider._id} cyclistData={rider} /> // Return the component here
    ))}

</>
  )
}


export default FantasyTeamScreen