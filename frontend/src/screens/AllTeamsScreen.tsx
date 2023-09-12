import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { useGetTeamsQuery } from "../slices/cyclistApiSlice";
import { Link } from "react-router-dom";

//ts for team and rest of component
const AllTeamsScreen = () => {
  const { data } = useGetTeamsQuery({});
  console.log(data);
  return (
    <ListGroup as="ol">
      {data?.map((team: any) => {
        return (
          <ListGroup.Item
            key={team._id}
            as="li"
            className="d-flex justify-content-between align-items-start"
          >
            <div className="ms-2 me-auto">
              <Link to={`/teams/${encodeURIComponent(team._id)}`}>
                <div className="fw-bold">{team._id}</div>
              </Link>
            </div>
            <Badge bg="primary" pill>
              {team.cyclists.length}
            </Badge>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default AllTeamsScreen;
