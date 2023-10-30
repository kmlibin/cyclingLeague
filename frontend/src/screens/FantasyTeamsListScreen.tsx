import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

//redux and api
import {
  useGetAllFantasyTeamsQuery,
  useCreateLeagueMutation,
} from "../slices/fantasyTeamApiSlice";
import { useAppSelector } from "../hooks/hooks";

//libraries
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";

import { MdGroupOff } from "react-icons/md";

//components
import ListOfTeams from "../components/ListTeams";
import Loader from "../components/Loader";
//interfaces and types
import { TeamError } from "../types/TeamError";

type League = {
  teamName: string;
  owner: { name: string; _id: string };
  id: string;
};

const FantasyTeamsListScreen: React.FC = () => {
  const [league, setLeague] = useState<League[]>([]);
  const [editing, setEditing] = useState(true);
  const [userFantasyTeam, setUserFantasyTeam] = useState<any | null>(null);
  const [leagueName, setLeagueName] = useState<string>();
  const [createError, setCreateError] = useState<TeamError | null>();
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const {
    data: team,
    isLoading: dataLoading,
    error: dataError,
  } = useGetAllFantasyTeamsQuery<any>({});

  const [createLeague, { isLoading, error: leagueError }] =
    useCreateLeagueMutation<any>();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo } = useAppSelector((state) => state.auth);

  //figure out the route we are on to conditionally show create button ui
  const createRoute = location.pathname === "/createleague";

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
      setCreateError({
        ...createError,
        alreadyOnTeam: "Team is already in league",
      });
      return league;
    }
    if (ids.length >= 10) {
      setCreateError({
        ...createError,
        teamLength: "Only 10 teams can be in the league",
      });
      return league;
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
      //check for league name
      if (!leagueName) {
        setCreateError({
          ...createError,
          teamName: "Please submit a name for your league",
        });
        return;
      }

      // must have more than 1 and less than 10 teams

      if (league.length <= 1 || league.length > 10) {
        setCreateError({
          ...createError,
          teamLength: "Must have more than one team, but less than ten teams",
        });
        return;
      }
      try {
        //make sure userInfo exists
        if (typeof userInfo === "object") {
          const res: any = await createLeague({
            id: userInfo._id,
            leagueDetails: {
              leagueName,
              teamIds,
            },
          });
          if ("error" in res) {
            return;
          } else {
            navigate(`/users/${userInfo._id}/dashboard`);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditing(false);
    setCreateError(null);
  };

  const editHandler = () => {
    setEditing(true);
  };

  // useEffect(() => {
  //   console.log(leagueError?.data?.msg);
  // });

  return (
    <>
      {dataLoading && <Loader />}
      {dataError && (
        <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
          {dataError?.data.msg}
        </div>
      )}

      {team && (
        <Container className="d-flex flex-column mt-2 mb-2">
          {createRoute && (
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>
                  <p>{leagueName}</p>
                </Accordion.Header>
                <Accordion.Body>
                  <ListGroup>
                    <ListGroup.Item>
                      <Row className="mb-3">
                        {" "}
                        <li>
                          Each user can only have <b>one</b> league
                        </li>
                        <li>
                          You may have no more than 10 fantasy teams in your
                          league
                        </li>
                        <li>You must submit a league name</li>
                      </Row>
                    </ListGroup.Item>
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
                                  onChange={(e) =>
                                    setLeagueName(e.target.value)
                                  }
                                ></Form.Control>
                              </Form.Group>
                              {createError?.teamName ? (
                                <Button variant="danger" type="submit">
                                  Submit League Name
                                </Button>
                              ) : (
                                <Button variant="info" type="submit">
                                  Submit League Name
                                </Button>
                              )}
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
                                Edit League Name
                              </Button>
                            ) : (
                              <Button variant="info" onClick={editHandler}>
                                Submit League Name
                              </Button>
                            )}
                          </Col>
                        )}

                        <Col xs={4}>
                          <Button variant="info" onClick={createLeagueHandler}>
                            Finalize League
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    {leagueError && (
                      <ListGroup.Item>
                        <Row className="w-100 d-flex justify-content-end error ">
                          {leagueError?.data.msg}
                        </Row>
                      </ListGroup.Item>
                    )}
                    {createError && (
                      <ListGroup.Item>
                        <Row className="w-100 d-flex justify-content-end error ">
                          {createError.teamName}
                        </Row>
                        <Row className="w-100 d-flex justify-content-end error ">
                          {createError.teamLength}
                        </Row>
                        <Row className="w-100 d-flex justify-content-end error ">
                          {createError.alreadyOnTeam}
                        </Row>
                      </ListGroup.Item>
                    )}
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
              <ListOfTeams
                key={team._id}
                team={team}
                teamName={team.teamName}
                onAddToLeague={addToLeague}
                createRoute={createRoute}
                //checks if the team has been added to the league
                isAddedToLeague={league.some(
                  (leagueTeam) => leagueTeam.id === team._id
                )}
                fantasyLeagueScreen={true}
                url={`/fantasyteams/${team._id}`}
              />
            ))}
          </ListGroup>
        </Container>
      )}
    </>
  );
};

export default FantasyTeamsListScreen;
