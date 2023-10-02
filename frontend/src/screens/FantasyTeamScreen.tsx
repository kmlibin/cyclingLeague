import React from "react";
import { useParams } from "react-router-dom";
import { useGetSingleFantasyTeamByIdQuery } from "../slices/fantasyTeamApiSlice";
import CyclistData from "../components/CyclistData";
import { Cyclist } from "../interfaces/Cyclist";

const FantasyTeamScreen: React.FC = () => {
  const { teamId } = useParams();
  const { data: team } = useGetSingleFantasyTeamByIdQuery(teamId);

  return (
    <>
      {team?.cyclists?.map((rider: Cyclist) => (
        <CyclistData key={rider._id} cyclistData={rider} /> // Return the component here
      ))}
    </>
  );
};

export default FantasyTeamScreen;
