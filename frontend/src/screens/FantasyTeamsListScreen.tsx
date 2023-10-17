import React, { useState, useEffect } from "react";

import ListGroup from "react-bootstrap/ListGroup";

import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import {
  useGetAllFantasyTeamsQuery,
  useCreateLeagueMutation,
} from "../slices/fantasyTeamApiSlice";

import { IoMdRemove } from "react-icons/io";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";

import { useAppSelector } from "../hooks/hooks";
import { useNavigate } from "react-router-dom";
import TeamList from "../components/TeamList";
import { MdGroupOff } from "react-icons/md";

type League = {
  teamName: string;
  owner: { name: string; _id: string };
  id: string;
};

const FantasyTeamsListScreen = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const [showCreateLeague, setShowCreateLeague] = useState(false);
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const { data: team } = useGetAllFantasyTeamsQuery({});
  const [league, setLeague] = useState<League[]>([]);
  const [editing, setEditing] = useState(true);
  const [userFantasyTeam, setUserFantasyTeam] = useState<any | null>(null);
  const [leagueName, setLeagueName] = useState<string>();
  const [createLeague, { isLoading, error }] = useCreateLeagueMutation();
  const navigate = useNavigate();

  //find logged in user's fantasy team so that it will always show in leagues, and cannot be deleted from league or ids
  useEffect(() => {
    if (team) {
      for (const t of team) {
        if (typeof userInfo === "object") {
          if (t.owner._id === userInfo._id) {
            setUserFantasyTeam({
              teamName: t.teamName,
              owner: { _id: t._id, name: t.owner.name },
              id: t._id,
            });
            break;
          }
        }
      }
    }
  }, [team, userInfo]);

  //kept getting stuck in infinite loop if this wasn't in a useEffect. now set teamIds and leagues so that users fantasy league is inside
  useEffect(() => {
    if (userFantasyTeam) {
      setTeamIds([userFantasyTeam.id]);
      setLeague([userFantasyTeam]);
    } else {
      console.log("User does not have a fantasy team.");
    }
  }, [userFantasyTeam]);

  //add team to league
  const addToLeague = (
    teamName: string,
    owner: { name: string; _id: string },
    id: string
  ) => {
    let ids: string[] = [];
    const leagueIds = league.map((team) => {
      ids.push(team.id);
    });

    if (ids.includes(id)) {
      return league;
      //send error
    }
    if (team.length >= 10) {
      return league;
      //send error
    } else {
      setLeague([...league, { teamName, owner, id }]);
      setTeamIds([...teamIds, id]);
    }
  };

  //delete team from league
  const deleteFromLeague = (idToDelete: string) => {
    //make sure logged in users team cannot be deleted
    if (userFantasyTeam && userFantasyTeam.id === idToDelete) {
      console.log("cannot delete");
      return;
    }

    const newLeague = league.filter((team) => team.id !== idToDelete);
    setLeague(newLeague);
    setTeamIds((prev) => prev.filter((id) => id !== idToDelete));
  };

  //send league to backend, to be stored in user model
  const createLeagueHandler = async () => {
    const confirmed = window.confirm(
      "Finalize league? You'll no longer be able to edit..."
    );
    if (confirmed) {
      try {
        //make sure userInfo exists
        if (typeof userInfo === "object") {
          const res = await createLeague({
            id: userInfo._id,
            leagueDetails: {
              leagueName,
              teamIds,
            },
          });

          navigate(`/users/${userInfo._id}/dashboard`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditing(false);
  };

  const editHandler = () => {
    setEditing(true);
  };

  useEffect(() => {
    console.log(league, teamIds);
  });

  return (
    <Container className="d-flex flex-column">
      {!showCreateLeague && (
        <Row className="button-container w-100 d-flex justify-content-end mb-2">
          <Button
            style={{ width: "15%" }}
            onClick={() => setShowCreateLeague(true)}
          >
            Create New League
          </Button>
        </Row>
      )}

      {showCreateLeague && (
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <p>{leagueName}</p>
            </Accordion.Header>
            <Accordion.Body>
              <ListGroup>
                <Row className="mb-3">Explain rules for league</Row>
                {league?.map((team) => (
                  <ListGroup.Item key={team.id} className="w-100">
                    <Row className="d-flex align-items-center">
                      <Col xs={2}>Owner: {team.owner.name}</Col>
                      <Col xs={2} className="fw-bold ">
                        {team.teamName}
                      </Col>

                      <Col xs={8} className="text-end">
                        <Button
                          size="sm"
                          variant="outline-danger"
                          style={{ marginLeft: "1rem" }}
                          onClick={() => deleteFromLeague(team.id)}
                        >
                          <MdGroupOff
                            style={{
                              fontSize: "1.5rem",
                            }}
                          />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item className="text-end">
                  <Row>
                    {editing ? (
                      <Col xs={8}>
                        <Form onSubmit={submitHandler} className="d-flex">
                          <Form.Group style={{ marginRight: "10px" }}>
                            <Form.Control
                              type="text"
                              placeholder="Enter Your League Name"
                              value={leagueName}
                              onChange={(e) => setLeagueName(e.target.value)}
                            ></Form.Control>
                          </Form.Group>
                          <Button variant="info" type="submit">
                            Submit Team Name
                          </Button>
                        </Form>
                      </Col>
                    ) : (
                      <Col className="d-flex">
                        <Badge
                          bg="dark"
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            marginRight: "10px",
                            minWidth: "20%",
                            fontSize: "18px",
                          }}
                        >
                          {leagueName}
                        </Badge>
                        {leagueName ? (
                          <Button variant="info" onClick={editHandler}>
                            Edit Team Name
                          </Button>
                        ) : (
                          <Button variant="info" onClick={editHandler}>
                            Submit Team Name
                          </Button>
                        )}
                      </Col>
                    )}

                    <Col xs={4}>
                      <Button variant="info" onClick={createLeagueHandler}>
                        Finalize Team
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}
      <ListGroup as="ol" className="d-flex align-items-center">
        <Row className="text-center m-2">
          <h2>Fantasy Teams</h2>
        </Row>
        {team?.map((team: any) => (
          <TeamList
            key={team._id}
            team={team}
            teamName={team.teamName}
            onAddToLeague={addToLeague}
            //checks if the team has been added to the league
            isAddedToLeague={league.some(
              (leagueTeam) => leagueTeam.id === team._id
            )}
            onDelete={deleteFromLeague}
            fantasyLeagueScreen={true}
            url={`/fantasyteams/${team._id}`}
          />
        ))}
      </ListGroup>
    </Container>
  );
};

export default FantasyTeamsListScreen;
