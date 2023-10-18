import React from "react";
import { Link } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { GrAdd } from "react-icons/gr";
import { IoMdRemove } from "react-icons/io";
import { ImCheckmark } from "react-icons/im";
import { Cyclist } from "../interfaces/Cyclist";

interface TeamItemProps {
  team: {
    _id: string;
    teamName: string;
    owner: { name: string; _id: string };
    cyclists: Cyclist[];
  };
  onDelete?: (id: string) => void;
  onAddToLeague?: (
    teamName: string,
    owner: { name: string; _id: string },
    id: string
  ) => void;
  isAddedToLeague?: boolean;
  createRoute?: boolean;
  teamName: string;
  fantasyLeagueScreen?: boolean;
  url: string;
}

const ListOfTeams: React.FC<TeamItemProps> = ({
  team,
  onAddToLeague,
  isAddedToLeague,
  teamName,
  fantasyLeagueScreen,
  url,
  createRoute,
}) => {
  const eightRiders = team.cyclists.slice(0, 8);

  //teamslist doesn't always have an  onaddtoleague passed in, so this helps to get around
  //TS complaining that they  might be undefined. i'd just called these directly and passed in the necessary info in the conditional
  //render, but then, as i said, TS complained.

  const handleAddToLeague = () => {
    if (onAddToLeague) {
      onAddToLeague(team.teamName, team.owner, team._id);
    }
  };
  return (
    <ListGroup.Item
      key={team._id}
      as="li"
      style={{ width: " 70%" }}
      className="d-flex align-items-center mt-2"
    >
      <div className="ms-2 me-auto">
        <Link to={`${url}`}>
          <div className="fw-bold">{teamName}</div>
        </Link>
      </div>
      <div className="d-flex">
        {eightRiders.map((rider: any) => (
          <img
            key={rider._id}
            src={rider.imageSrc}
            alt={rider.name}
            className="me-2 mb-2"
            style={{ width: "40px", height: "50px", borderRadius: "50%" }}
          />
        ))}
      </div>
      . . . &nbsp;
      <Badge bg="primary" pill className="mr-4">
        {team.cyclists.length}
      </Badge>
      {/* Conditionally render buttons based on the screen */}
      {fantasyLeagueScreen && createRoute ? (
        // Buttons for FantasyTeamsListScreen
        isAddedToLeague ? (
          <ImCheckmark
            style={{ color: "green", fontSize: "1.7em", marginLeft: "1rem" }}
          />
        ) : (
          <button onClick={handleAddToLeague} style={{ marginLeft: "1rem" }}>
            <GrAdd style={{ fontSize: "1.7rem", backgroundColor: "white" }} />
          </button>
        )
      ) : null}
    </ListGroup.Item>
  );
};

export default ListOfTeams;
