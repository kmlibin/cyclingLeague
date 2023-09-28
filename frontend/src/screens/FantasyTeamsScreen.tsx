import React, { useState } from "react";
import { Link } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import { useGetAllFantasyTeamsQuery } from "../slices/fantasyTeamApiSlice";
import { GrAdd } from "react-icons/gr";

const FantasyTeamsScreen = () => {
  const [createLeague, setCreateLeague] = useState(true);
  const [edit, setEdit] = useState(false);
  const [leagueName, setLeagueName] = useState("Click to Edit Team Name");
  const { data: team } = useGetAllFantasyTeamsQuery({});
  console.log(team);


  const addToLeague = (id: string) => {};
  return (
    <Container className="d-flex flex-column">
      <div className="button-container w-100 d-flex justify-content-end mb-2">
        <Button style={{ width: "15%" }} onClick={() => setCreateLeague(true)}>
          Create New League
        </Button>
      </div>
      {createLeague && (
        <Accordion>
          <Accordion.Item eventKey="0">
          <Accordion.Header>
            {edit ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                setEdit(false)
              }}>
                <input
                  type="text"
                  placeholder="League Name"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                />
                {/* <button type="submit">Save</button> */}
              </form>
            ) : (
              <div onClick={() => setEdit(true)}>{leagueName}</div>
            )}
          </Accordion.Header>

            <Accordion.Body>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
      <ListGroup as="ol">
        {team?.map((team: any) => {
          return (
            <ListGroup.Item
              key={team._id}
              as="li"
              className="d-flex justify-content-between align-items-center mt-2"
            >
              <div className="ms-2 me-auto">
                <Link to={`/fantasyteams/${encodeURIComponent(team._id)}`}>
                  <div className="fw-bold">{team.teamName}</div>
                </Link>
              </div>
              <Badge bg="primary" pill className="mr-4">
                {team.cyclists.length}
              </Badge>

              {createLeague && (
                <button
                  onClick={() => addToLeague(team._id)}
                  style={{ backgroundColor: "white", marginLeft: "1rem" }}
                >
                  <GrAdd style={{ fontSize: "1.7em", color: "black" }} />
                </button>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  );
};

export default FantasyTeamsScreen;
