import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useGetTeamsQuery } from "../slices/cyclistApiSlice";
import { Link, useParams } from "react-router-dom";
import TeamList from "../components/TeamList";
import Row from "react-bootstrap/Row";
import Paginate from "../components/Paginate";

const AllTeamsScreen = () => {
  const { pageNumber } = useParams()
  const { data } = useGetTeamsQuery({pageNumber});

  return (
    <>
      <ListGroup as="ol" className="d-flex align-items-center">
        <Row className="text-center m-2">
          <h2>Teams</h2>
        </Row>
        {data?.teamRoster?.map((team: any) => (
          <TeamList key={team._id} team={team} teamName={team._id} />
        ))}
      </ListGroup>
      <div className="d-flex justify-content-center mt-3">
      <Paginate pages={data?.pages} page={data?.page} />
      </div>
    </>
  );
};

export default AllTeamsScreen;
