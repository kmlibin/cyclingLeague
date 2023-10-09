import React from "react";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";

import { useGetSingleFantasyTeamByIdQuery } from "../slices/fantasyTeamApiSlice";
import { useGetSingleTeamQuery } from "../slices/cyclistApiSlice";
import CyclistData from "../components/CyclistData";
import { Cyclist } from "../interfaces/Cyclist";

const TeamDataScreen: React.FC = () => {
  const { teamId } = useParams();
  const { name } = useParams();

  const { data: fantasyTeam } = useGetSingleFantasyTeamByIdQuery(name || "");
  const { data: team } = useGetSingleTeamQuery(decodeURIComponent(teamId || ""));

  const cyclists = fantasyTeam?.cyclists || team?.cyclists || [];

  return (
    <>
      {team && <h1 className="text-center mt-2 mb-5">{team._id}</h1>}
      {fantasyTeam && <h1 className="text-center mt-2 mb-5">{fantasyTeam.teamName}</h1>}
      <Container
        fluid
        className="d-flex flex-wrap justify-content-evenly"
        style={{ backgroundColor: "pink" }}
      >
        {cyclists.map((rider: Cyclist) => (
          <CyclistData key={rider._id} cyclistData={rider} />
        ))}
      </Container>
    </>
  );
};

export default TeamDataScreen;
