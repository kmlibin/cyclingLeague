import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useGetTeamsQuery } from "../slices/cyclistApiSlice";
import { Link } from "react-router-dom";
import TeamList from "../components/TeamList"; // Import the TeamItem component

const AllTeamsScreen = () => {
  const { data } = useGetTeamsQuery({});
  console.log(data);

  return (
    <ListGroup as="ol">
      {data?.map((team: any) => (
        <TeamList key={team._id} team={team} teamName={team._id} />
      ))}
    </ListGroup>
  );
};

export default AllTeamsScreen;
