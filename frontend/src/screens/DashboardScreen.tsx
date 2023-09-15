import React from "react";
import { useGetSingleFantasyTeamQuery } from "../slices/fantasyTeamApiSlice";
import { useParams } from "react-router-dom";

import CyclistData from "../components/CyclistData";

const DashboardScreen: React.FC = () => {
    const {id} = useParams()
    console.log(id)
    const { data: team } = useGetSingleFantasyTeamQuery(id);
    console.log(team);

  return (
    <p>DashbArod screen</p>
  )
};

export default DashboardScreen;
