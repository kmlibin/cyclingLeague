import React, { useEffect } from "react";
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

import TeamList from "../components/TeamList";

const DashboardScreen: React.FC = () => {
  const { id } = useParams();
  console.log(id);
  const { data: team } = useGetSingleFantasyTeamQuery(id);
  const { data: league, refetch }: any = useGetLeagueQuery(id);
  console.log(league);
  const { userInfo } = useAppSelector((state) => state.auth);

  //can't figure out why, but getleaguequery isn't hitting the backend on navigate, only does so if i refresh the page. this forces it
  //to fetch once it mounts. not ideal, but it's a fine patch until i can figure out why the behavior happens.
  useEffect(() => {
    refetch();
  }, []);

  return (
    <Container
      fluid
      className="d-flex flex-row justify-content-center"
      style={{ backgroundColor: "black" }}
    >
      <Row style={{ backgroundColor: "yellow" }} xs={1} md={3}>
        <Col>
          <p>gots to say a lot of stuff</p>
        </Col>
      </Row>
      <Row xs={1} md={9} style={{ backgroundColor: "pink" }}>
      <Row className="mt-4 mb-4 text-center">
              <h2>
                <b>{team?.teamName}</b>
              </h2>
            </Row>
        <Col>
          <Container fluid className="d-flex flex-column">
            <Row style={{ backgroundColor: "blue" }}>
              <Col className="mt-4">
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
                      <td className="d-flex justify-content-end">{team.totalPoints}</td>
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
