import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useGetTeamsQuery } from "../slices/cyclistApiSlice";
import { Link } from "react-router-dom";
import TeamList from "../components/TeamList"; 
import Row from 'react-bootstrap/Row'

const AllTeamsScreen = () => {
  const { data } = useGetTeamsQuery({});
  console.log(data);

  return (
    <ListGroup as="ol" className="d-flex align-items-center">
       <Row className="text-center m-2">
          <h2>Teams</h2>
        </Row>
      {data?.map((team: any) => (
        <TeamList key={team._id} team={team} teamName={team._id} />
      ))}
    </ListGroup>
  );
};

export default AllTeamsScreen;
