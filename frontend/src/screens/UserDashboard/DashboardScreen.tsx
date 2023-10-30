import React, { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import {
  useGetLeagueQuery,
  useGetSingleFantasyTeamQuery,
} from "../../slices/fantasyTeamApiSlice";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import { Cyclist } from "../../interfaces/Cyclist";
import Loader from "../../components/Loader";
import Button from "react-bootstrap/Button";
import Error from "../../components/Error";
import { BsStarFill } from "react-icons/bs";
import MyFantasyTeamTable from "./MyFantastyTeamTable";
import PieChartComponent from "../../components/PieChartComponent";
import { LinkContainer } from "react-router-bootstrap";
import SpecialtyBarChart from "./SpecialtyBarChart";
import CyclistMiniData from "./CyclistMiniData";
import { FantasyTeam } from "../../interfaces/FantasyTeam";
import { findSharedRiders } from "../../utils/calculateStats";
import {
  cyclistsPerSpecialty,
  highScore,
  worstValueCyclist,
  teamSpecialties,
  bestValueCyclist,
} from "../../utils/calculateStats";

type SpecialtyData = {
  specialty: string;
  points: number;
};

const DashboardScreen: React.FC = () => {
  const { id } = useParams();
  const {
    data: team,
    isLoading: teamLoading,
    error: teamError,
  } = useGetSingleFantasyTeamQuery<any>(id);
  const {
    data: league,
    refetch,
    isLoading: leagueLoading,
    error: leagueError,
  }: any = useGetLeagueQuery<any>(id);
  const [topCyclist, setTopCyclist] = useState<Cyclist | null>(null);
  const [worstValue, setWorstValue] = useState<Cyclist | null>(null);
  const [bestValue, setBestValue] = useState<Cyclist>();
  const [specialties, setSpecialties] = useState<SpecialtyData[]>();
  const [sortedTeams, setSortedTeams] = useState<FantasyTeam[]>();

  const dispatch = useAppDispatch();
  const [cyclistCounts, setCyclistCounts] = useState({
    sprinters: 0,
    climbers: 0,
    timetrial: 0,
    oneday: 0,
  });

  const { userInfo } = useAppSelector((state) => state.auth);

  const userId = typeof userInfo === "object" ? userInfo._id : null;
  const myTeam = typeof userInfo === "object" ? userInfo.fantasyTeam : null;
  //can't figure out why, but getleaguequery isn't hitting the backend on navigate, only does so if i refresh the page. this forces it
  //to fetch once it mounts. not ideal, but it's a fine enough patch.
  useEffect(() => {
    refetch();
  }, []);

  //make sure league is sorted by total points score
  const leagueSort = () => {
    if (league) {
      const sort = [...league.teamIds].sort(
        (a, b) => b.totalPoints - a.totalPoints
      );
      setSortedTeams(sort);
    }
  };

  console.log(sortedTeams);
  //call functions that calculate the data for stats
  useEffect(() => {
    //find highest scoring cyclist
    setTopCyclist(highScore(team));
    //find best value cyclist
    setBestValue(bestValueCyclist(team));
    //sort out team specialties and points for each specialty
    setSpecialties(teamSpecialties(team));
    //how many cyclists are which specialty
    setCyclistCounts(cyclistsPerSpecialty(team));
    //least cost effective rider
    setWorstValue(worstValueCyclist(team));
    //figure out how many shared riders there are between leagues
    findSharedRiders(dispatch, team, league, userId);
    leagueSort();
  }, [team, league]);

  const bardata = [
    {
      name: "Sprinters",
      lName: "S",
      count: cyclistCounts.sprinters,
    },
    {
      name: "Climbers",
      lName: "C",
      count: cyclistCounts.climbers,
    },
    {
      name: "Time Trial",
      lName: "TT",
      count: cyclistCounts.timetrial,
    },
    {
      name: "One Day Specialists",
      lName: "O",
      count: cyclistCounts.oneday,
    },
  ];

  const COLORS = ["#009900", "#ffa500", "#51d5eb", "#cc0000"];

  //did these separately so that I could put them in their own containers for styling purposes
  if (teamLoading) {
    return (
      <Container
        className="d-flex flex-column justify-content-center flex-lg-row"
        style={{ backgroundColor: "#FBF4D4", minHeight: "100vh" }}
      >
        <Loader />
      </Container>
    );
  }

  if (teamError && myTeam) {
    return (
      <Container
        className="d-flex flex-column justify-content-center flex-lg-row"
        style={{ backgroundColor: "#FBF4D4", minHeight: "100vh" }}
      >
        <Error error={teamError} />
      </Container>
    );
  }
  console.log(league?.teamIds);
  return (
    <Container
      className="d-flex flex-column justify-content-center flex-lg-row"
      style={{ backgroundColor: "#FBF4D4", minHeight: "100vh" }}
    >
      {!team ? (
        <div className="d-flex flex-column justify-content-center align-items-center">
          <h1>You don't have a fantasy team yet.</h1>
          <h4 className="mt-3">Create one now!</h4>
          <LinkContainer to="/createteam">
            <Button className="mt-4">Build Your Team</Button>
          </LinkContainer>
        </div>
      ) : (
        <>
          {/* column on left side of screen that shows various team stats */}
          <Row className="d-flex justify-content-center item-margin pb-4">
            <Col
              sm={12}
              md={3}
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ width: "90%" }}
            >
              <h5 className="mt-2 mb-2">Best Value Cyclist</h5>
              <CyclistMiniData cyclistData={bestValue ? bestValue : null} />

              <h5 className="mt-2 mb-2">Highest Scoring Cyclist</h5>
              <CyclistMiniData cyclistData={topCyclist ? topCyclist : null} />

              <h5 className="mt-2 mb-2">Least Cost Effective Cyclist</h5>
              <CyclistMiniData cyclistData={worstValue ? worstValue : null} />

              <h5 className="mt-2 mb-2 text-center">
                {team?.teamName}'s Riders per Specialty
              </h5>
              <Card className="w-100 shadow">
                <Card.Body>
                  <SpecialtyBarChart bardata={bardata} colors={COLORS} />
                </Card.Body>
              </Card>

              <h5 className="mt-2 mb-2">{team?.teamName}'s Points Breakdown</h5>
              <Card className="w-100">
                <Card.Body>
                  <PieChartComponent specialties={specialties} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* holds the fantasy team chart and league beneath */}

          <Row className="d-flex flex-row text-center">
            <Col sm={12} md={12}>
              <Container fluid className="d-flex flex-column">
                <h2 className="m-3">
                  My Team: <b>{team?.teamName}</b>
                </h2>
                <Row style={{ minWidth: "100%" }}>
                  <Col className="m-0" sm={12} lg={12}>
                    <MyFantasyTeamTable data={team} />
                  </Col>
                </Row>
                {leagueError && <Error error={leagueError} />}
                {league?.teamIds.length > 0 ? (
                  <>
                    <Row className="mt-4 mb-4 text-center">
                      <h2>
                        My League: <b>{league?.name}</b>
                      </h2>
                    </Row>
                    <Container style={{ maxWidth: "100%" }}>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th className="left">User</th>
                            <th
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            >
                              Team Name
                            </th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedTeams?.map((team: any, index) => (
                            <tr key={team._id}>
                              <td>{index + 1}</td>
                              <td className="left">
                                <div className="d-flex align-items-center">
                                {userId === team.owner._id ? (
                                  <BsStarFill style={{marginRight: "5px", color: "#A14FE0"}}/>
                                ) : null}
                                {team.owner.name}
                                </div>
                              </td>
                              <LinkContainer to={`/fantasyteams/${team._id}`}>
                                <td className="link-styles">{team.teamName}</td>
                              </LinkContainer>
                              <td>{Math.floor(Number(team.totalPoints))}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Container>
                  </>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center mt-5">
                    <h1>You haven't created a league yet.</h1>
                    <h4 className="mt-3">Create one now!</h4>
                    <LinkContainer to="/createleague">
                      <Button className="mt-4">Build Your League</Button>
                    </LinkContainer>
                  </div>
                )}
              </Container>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default DashboardScreen;
