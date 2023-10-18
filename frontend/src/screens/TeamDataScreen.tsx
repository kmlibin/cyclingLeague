import React from "react";
import { useParams, useLocation } from "react-router-dom";

//libraries
import Container from "react-bootstrap/Container";

//api / redux
import { useAppSelector } from "../hooks/hooks";
import { useGetSingleFantasyTeamByIdQuery } from "../slices/fantasyTeamApiSlice";
import { useGetSingleTeamQuery } from "../slices/cyclistApiSlice";

//components
import CyclistData from "./CyclistDataScreen/CyclistData";


//interfaces
import { Cyclist } from "../interfaces/Cyclist";

const TeamDataScreen: React.FC = () => {
  const { teamId } = useParams();
  const { name } = useParams();
  const location = useLocation();
  const { data: fantasyTeam, refetch: fantasyRefetch } =
    useGetSingleFantasyTeamByIdQuery(name || "");
  const { data: team, refetch: teamRefetch } = useGetSingleTeamQuery(
    decodeURIComponent(teamId || "")
  );

  //need to determine the route - there was a bug when you'd click from fantasy team to a trade team b/c both team and fantasyteam
  //are present.
  const isFantasyTeamRoute = location.pathname.startsWith("/fantasyteams");

  const cyclists = isFantasyTeamRoute
    ? fantasyTeam?.cyclists || []
    : team?.cyclists || [];

  const state = useAppSelector((state: any) => state.sharedRiders);
  const { user } = state;
  //check to see if the shared riders are on the logged in users team...will use so that "on my team" will not
  //render for every single person on their team.

  const isMyTeam = fantasyTeam?.owner === user;

  return (
    <>
      {!isFantasyTeamRoute && team && (
        <h1 className="text-center mt-2 mb-5">{team._id}</h1>
      )}
      {isFantasyTeamRoute && fantasyTeam && (
        <h1 className="text-center mt-2 mb-5">{fantasyTeam.teamName}</h1>
      )}
      <Container
        fluid
        className="d-flex flex-wrap justify-content-evenly"
        style={{ backgroundColor: "pink" }}
      >
        {cyclists.map((rider: Cyclist) => (
          <CyclistData
            key={rider._id}
            cyclistData={rider}
            isMyTeam={isMyTeam}
          />
        ))}
      </Container>
    </>
  );
};

export default TeamDataScreen;
