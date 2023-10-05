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
import ListGroup from "react-bootstrap/ListGroup";

import TeamList from "../components/TeamList";
import PieChartComponent from "../components/PieChartComponent";

type SpecialtyData = {
  specialty: string;
  points: number;
};
const DashboardScreen: React.FC = () => {
  const { id } = useParams();
  console.log(id);
  const { data: team } = useGetSingleFantasyTeamQuery(id);
  const { data: league, refetch }: any = useGetLeagueQuery(id);
  const [topCyclist, setTopCyclist] = useState<Cyclist>();
  const [bestValue, setBestValue] = useState<Cyclist>();
  const [specialties, setSpecialties] = useState<SpecialtyData[]>();
  console.log(team);
  const { userInfo } = useAppSelector((state) => state.auth);

  //can't figure out why, but getleaguequery isn't hitting the backend on navigate, only does so if i refresh the page. this forces it
  //to fetch once it mounts. not ideal, but it's a fine patch until i can figure out why the behavior happens.
  useEffect(() => {
    refetch();
  }, []);

  //find highest scorer on team
  const highScore = () => {
    if (team) {
      const { cyclists } = team;
      let score = 0;
      //check the current uci points of each cyclist, store highest one in state
      for (const cyclist of cyclists) {
        if (cyclist.currentUciPoints > score) {
          score = cyclist.currentUciPoints;
          setTopCyclist(cyclist);
        }
      }
    }
    return null;
  };

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

  useEffect(() => {
    highScore();
    bestValueCyclist();
    teamSpecialties();
  }, [team]);

  console.log(topCyclist, bestValue, specialties);

  const first = team?.cyclists[0];

  return (
    <Container
      className="d-flex flex-row justify-content-center "
      style={{ backgroundColor: "black" }}
    >
      <Row
        md={3}
        className="item1  align-items-center"
        style={{ backgroundColor: "yellow" }}
      >
        <Col className="d-flex flex-column align-items-center w-100">
          <Card className="d-flex flex-row justify-content-center w-100 m-1">
            <Col>
              <Card.Img src={topCyclist?.imageSrc} />
            </Col>
            <Col>
              <Card.Body>
                <Card.Title>{topCyclist?.name}</Card.Title>
                <br></br>
                <Card.Text className="mb-0">
                  Country: {topCyclist?.nationalityName}
                </Card.Text>
                <Card.Text className="mb-0">
                  Current Rank: {topCyclist?.currentRank}
                </Card.Text>
                <Card.Text className="mb-0">
                  {topCyclist?.mainSpecialty}
                </Card.Text>
              </Card.Body>
            </Col>
          </Card>
          <Card className="w-100">
            <Card.Body>
              <Card.Title className=" card-title-padding text-center" >
                {team?.teamName} Specialty Breakdown
              </Card.Title>
              <PieChartComponent specialties={specialties} />
            </Card.Body>
          </Card>
          <Card className="d-flex flex-row justify-content-center w-100 m-1">
            <Col>
              <Card.Img src={bestValue?.imageSrc} />
            </Col>
            <Col>
              <Card.Body>
                <Card.Title>{bestValue?.name}</Card.Title>
                <br></br>
                <Card.Text className="mb-0">
                  Country: {bestValue?.nationalityName}
                </Card.Text>
                <Card.Text className="mb-0">
                  Current Rank: {bestValue?.currentRank}
                </Card.Text>
                <Card.Text className="mb-0">
                  {bestValue?.mainSpecialty}
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
            <h2>
              <b>{team?.teamName}</b>
            </h2>
            <Row style={{ backgroundColor: "blue", minWidth: "100%" }}>
              <Col className="m-0">
                <TeamList data={team} />
              </Col>
            </Row>
            <Row className="mt-4 mb-4 text-center">
              <h2>
                My League: <b>{league?.name}</b>
              </h2>
            </Row>
            <Container style={{ maxWidth: "60%" }}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Team Name</th>
                    <th className="d-flex justify-content-end">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {league?.teamIds.map((team: any) => (
                    <tr key={team._id}>
                      <td>{team.teamName}</td>
                      <td className="d-flex justify-content-end">
                        {team.totalPoints}
                      </td>
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
