import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Accordion from "react-bootstrap/Accordion";
import Container from "react-bootstrap/Container";
import { useGetAllFantasyTeamsQuery } from "../slices/fantasyTeamApiSlice";
import { GrAdd } from "react-icons/gr";
import { IoMdRemove } from "react-icons/io";
import { FantasyTeam } from "../interfaces/Cyclist";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ImCheckmark } from "react-icons/im";
import { User } from "../interfaces/Cyclist";
import { useAppSelector } from "../hooks/hooks";
import { isDoStatement } from "typescript";

type League = {
  teamName: string;
  owner: { name: string; _id: string };
  id: string;
};

const FantasyTeamsScreen = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const [createLeague, setCreateLeague] = useState(false);
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const { data: team } = useGetAllFantasyTeamsQuery({});
  const [league, setLeague] = useState<League[]>([]);
  const [edit, setEdit] = useState(false);
  const [userFantasyTeam, setUserFantasyTeam] = useState<any | null>(null);
  const [leagueName, setLeagueName] = useState("Click to Edit League Name");

  //find logged in user's fantasy team so that it will always show in leagues, and cannot be deleted from league or ids
  useEffect(() => {
    if (team) {
      for (const t of team) {
        if (typeof userInfo === "object") {
          if (t.owner._id === userInfo._id) {
            console.log(t);
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
    let ids: string[] = [];
    const leagueIds = league.map((team) => {
      ids.push(team.id);
    });

    const newLeague = league.filter((team) => team.id !== idToDelete);
    setLeague(newLeague);
    setTeamIds((prev) => prev.filter((id) => id !== idToDelete));
  };

  //   const createLeagueHandler = async () => {
  //     const confirmed = window.confirm(
  //       "Finalize league? You'll no longer be able to edit..."
  //     );
  //     if (confirmed) {
  //       try {
  //         const cyclistIds: string[] = teamIds;
  //         console.log(cyclistIds);
  //         const res = await createTeam({
  //           cyclistIds,
  //           teamName,
  //         });

  //         //save to local state
  //         //have to typecheck it for the reducer in authSlice (update team, either can have string or object)
  //         if (typeof userInfo === "object") {
  //           const updatedTeamInfo = {
  //             cyclists: cyclistIds,
  //             teamName,
  //           };
  //           dispatch(updateTeam(updatedTeamInfo));
  //           navigate(`/users/${userInfo._id}/dashboard`)
  //         }

  //       } catch (error) {
  //         console.log(error);
  //       }
  //     }
  //   };

  useEffect(() => {
    console.log(league, teamIds);
  });

  return (
    <Container className="d-flex flex-column">
      {!createLeague && (
        <Row className="button-container w-100 d-flex justify-content-end mb-2">
          <Button
            style={{ width: "15%" }}
            onClick={() => setCreateLeague(true)}
          >
            Create New League
          </Button>
        </Row>
      )}

      {createLeague && (
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              {edit ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setEdit(false);
                  }}
                >
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
              {league?.map((team) => (
                <ListGroup.Item
                  key={team.id}
                  as="li"
                  className="d-flex justify-content-between align-items-center mt-2"
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{team.teamName}</div>
                    {team.owner.name}
                  </div>
                  <div></div>
                  <Button
                    style={{ marginLeft: "1rem" }}
                    size="sm"
                    variant="danger"
                    onClick={() => deleteFromLeague(team.id)}
                  >
                    <IoMdRemove
                      style={{ fontSize: "1.9rem", color: "black" }}
                    />
                  </Button>
                </ListGroup.Item>
              ))}

              <ListGroup.Item className="d-flex justify-content-center align-items-end flex-column mt-2">
                <Row>
                  <Col>
                    <Button variant="info">Finalize Team</Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )}

      <ListGroup as="ol">
        <Row className="text-center m-2">
          <h2>Fantasy Teams</h2>
        </Row>
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
                <Button
                  variant="success"
                  onClick={() =>
                    addToLeague(team.teamName, team.owner, team._id)
                  }
                  style={{ marginLeft: "1rem" }}
                >
                  {league.some((leagueTeam) => leagueTeam.id === team._id) ? (
                    <ImCheckmark />
                  ) : (
                    <GrAdd style={{ fontSize: "1.7rem", color: "green" }} />
                  )}
                </Button>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Container>
  );
};

export default FantasyTeamsScreen;
