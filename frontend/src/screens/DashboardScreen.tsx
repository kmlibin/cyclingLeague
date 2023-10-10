import React, { useState, useEffect } from "react";
import { useAppSelector } from "../hooks/hooks";
import {
  useGetLeagueQuery,
  useGetSingleFantasyTeamQuery,
} from "../slices/fantasyTeamApiSlice";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import { Cyclist } from "../interfaces/Cyclist";
import calculatePrice from "../utils/calculatePoints";
import TeamTable from "../components/TeamTable";
import PieChartComponent from "../components/PieChartComponent";
import { LinkContainer } from "react-router-bootstrap";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import SpecialtyBarChart from "../components/SpecialtyBarChart";

type SpecialtyData = {
  specialty: string;
  points: number;
};

const DashboardScreen: React.FC = () => {
  const { id } = useParams();

  const { data: team } = useGetSingleFantasyTeamQuery(id);
  const { data: league, refetch }: any = useGetLeagueQuery(id);
  const [topCyclist, setTopCyclist] = useState<Cyclist | null>(null);
  const [bestValue, setBestValue] = useState<Cyclist>();
  const [specialties, setSpecialties] = useState<SpecialtyData[]>();
  const [sortedTeams, setSortedTeams] = useState<any[]>();
  const [cyclistCounts, setCyclistCounts] = useState({
    sprinters: 0,
    climbers: 0,
    timetrial: 0,
    oneday: 0,
  });
  const { userInfo } = useAppSelector((state) => state.auth);

  //can't figure out why, but getleaguequery isn't hitting the backend on navigate, only does so if i refresh the page. this forces it
  //to fetch once it mounts. not ideal, but it's a fine patch until i can figure out why the behavior happens.
  useEffect(() => {
    refetch();
  }, []);

  const cyclistsPerSpecialty = () => {
    const counts = {
      sprinters: 0,
      climbers: 0,
      timetrial: 0,
      oneday: 0,
    };
    if (team) {
      const { cyclists } = team;

      cyclists.forEach((cyclist: Cyclist) => {
        switch (cyclist.mainSpecialty) {
          case "Sprint":
            counts.sprinters++;
            break;
          case "Climber":
            counts.climbers++;
            break;
          case "Time trial":
            counts.timetrial++;
            break;
          case "One day races":
            counts.oneday++;
        }
      });
      setCyclistCounts(counts);
    }
  };

  //find highest scorer on team
  const highScore = () => {
    if (team) {
      const { cyclists } = team;

      let score = 0;
      let topCyclist: Cyclist | null = null;
      //check the current uci points of each cyclist, store highest one in state
      for (const cyclist of cyclists) {
        if (Math.floor(cyclist.currentUciPoints) > Math.floor(score)) {
          score = cyclist.currentUciPoints;
          topCyclist = cyclist;
        }
      }
      setTopCyclist(topCyclist);
    }
    return null;
  };

  console.log(topCyclist);
  //find best value cyclist on team
  const bestValueCyclist = () => {
    if (team) {
      //grab cyclists
      const { cyclists } = team;
      let bestValue = 0;

      for (const cyclist of cyclists) {
        //calculate how much they cost the user to put on team
        const price = calculatePrice(cyclist.yearEndUciPoints);
        //find ratio of how many points they've so far vs how much they cost
        const value = cyclist.currentUciPoints / price;
        //will put the cyclist with highest value in state
        if (value > bestValue) {
          bestValue = value;
          setBestValue(cyclist);
        }
      }
    }
    return null;
  };

  const teamSpecialties = () => {
    let data: SpecialtyData[] = [
      { specialty: "One day races", points: 0 },
      { specialty: "GC", points: 0 },
      { specialty: "Time trial", points: 0 },
      { specialty: "Sprint", points: 0 },
      { specialty: "Climber", points: 0 },
    ];

    if (team) {
      const { cyclists } = team;

      for (const cyclist of cyclists) {
        for (const specialtyObject of cyclist.riderSpecialties) {
          //find the right object in the data and update its points
          const matchingSpecialty = data.find(
            (item) => item.specialty === specialtyObject.specialty
          );
          if (matchingSpecialty) {
            matchingSpecialty.points += specialtyObject.points;
          }
        }
      }
    }
    setSpecialties(data);
  };

  //make sure league is sorted by total points score
  const leagueSort = () => {
    if (league) {
      const sort = [...league.teamIds].sort(
        (a, b) => b.totalPoints - a.totalPoints
      );
      setSortedTeams(sort);
    }
  };

  //call functions that calculate the data for stats
  useEffect(() => {
    highScore();
    bestValueCyclist();
    teamSpecialties();
    cyclistsPerSpecialty();
    leagueSort();
  }, [team, league]);

  const bardata = [
    {
      name: "Sprinters",
      lName: "S",
      count: cyclistCounts.sprinters,
      color: "#cc0000",
    },
    {
      name: "Climbers",
      lName: "C",
      count: cyclistCounts.climbers,
      color: "#6751eb",
    },
    {
      name: "Time Trial",
      lName: "TT",
      count: cyclistCounts.timetrial,
      color: "#51d5eb",
    },
    {
      name: "One Day Specialists",
      lName: "O",
      count: cyclistCounts.oneday,
      color: "#ffa500",
    },
  ];

  const COLORS = ["#009900", "#ffa500", "#51d5eb", "#cc0000"];
  return (
    <Container
      className="d-flex flex-row justify-content-center"
      style={{ backgroundColor: "black" }}
    >
      <Row
        md={3}
        className="d-flex justify-content-center item-margin"
        style={{ backgroundColor: "yellow" }}
      >
        <Col
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ width: "90%" }}
        >
          <h5 className="mt-2 mb-2">{team?.teamName}'s Highest Scorer</h5>
          <Card className="d-flex flex-row justify-content-center w-100">
            <Col>
              <Card.Img src={topCyclist?.imageSrc} />
            </Col>
            <Col>
              <Card.Body>
                <Card.Title>{topCyclist?.name}</Card.Title>
                <br></br>
                <Card.Text className="mb-0">
                  <b>Country:</b>&nbsp;{topCyclist?.nationalityName}
                </Card.Text>
                <Card.Text className="mb-0">
                  <b>Current Rank:</b>&nbsp;{topCyclist?.currentRank}
                </Card.Text>
                <Card.Text className="mb-0">
                  <b>Specialty:</b> &nbsp;
                  {topCyclist?.mainSpecialty}
                </Card.Text>
              </Card.Body>
            </Col>
          </Card>
          <h5 className="mt-2 mb-2 text-center">{team?.teamName}'s Riders per Specialty</h5>
          <Card className="w-100">
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
          <h5 className="mt-2 mb-2">{team?.teamName}'s Best Value</h5>
          <Card className="d-flex flex-row justify-content-center w-100 mb-2">
            <Col>
              <Card.Img src={bestValue?.imageSrc} />
            </Col>
            <Col>
              <Card.Body>
                <Card.Title>{bestValue?.name}</Card.Title>
                <br></br>
                <Card.Text className="mb-0">
                  <b>Country:</b>&nbsp;{bestValue?.nationalityName}
                </Card.Text>
                <Card.Text className="mb-0">
                  <b>Current Rank:</b>&nbsp;{bestValue?.currentRank}
                </Card.Text>
                <Card.Text className="mb-0">
                  <b>Specialty:</b>&nbsp;{bestValue?.mainSpecialty}
                </Card.Text>
              </Card.Body>
            </Col>
          </Card>
        </Col>
      </Row>
      <Row
        className="d-flex flex-row text-center"
        style={{ backgroundColor: "pink" }}
      >
        <Col>
          <Container fluid className="d-flex flex-column">
            <h2 className="m-3">
              My Team: <b>{team?.teamName}</b>
            </h2>
            <Row style={{ minWidth: "100%" }}>
              <Col className="m-0">
                <TeamTable data={team} />
              </Col>
            </Row>
            <Row className="mt-4 mb-4 text-center">
              <h2>
                My League: <b>{league?.name}</b>
              </h2>
            </Row>
            <Container style={{ maxWidth: "70%" }}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th className="left">User</th>
                    <th
                      style={{ display: "flex", justifyContent: "flex-start" }}
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
                      <td className="left">{team.owner.name}</td>
                      <LinkContainer to={`/fantasyteams/${team._id}`}>
                        <td className="link-styles">{team.teamName}</td>
                      </LinkContainer>
                      <td>{Math.floor(Number(team.totalPoints))}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardScreen;
