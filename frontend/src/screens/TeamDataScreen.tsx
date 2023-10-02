import React from 'react';
import { useParams } from 'react-router-dom';

import { useGetSingleFantasyTeamByIdQuery } from '../slices/fantasyTeamApiSlice';
import { useGetSingleTeamQuery } from '../slices/cyclistApiSlice';
import CyclistData from '../components/CyclistData';
import { Cyclist } from '../interfaces/Cyclist';

const TeamDataScreen: React.FC = () => {
    const { teamId } = useParams();
    const  {name} = useParams();

  const { data: fantasyTeam } = useGetSingleFantasyTeamByIdQuery(teamId || '');
  const { data: team } = useGetSingleTeamQuery(decodeURIComponent(name || ''));

  const cyclists = fantasyTeam?.cyclists || team?.cyclists || [];

  return (
    <>
      {cyclists.map((rider: Cyclist) => (
        <CyclistData key={rider._id} cyclistData={rider} />
      ))}
    </>
  );
};

export default TeamDataScreen;