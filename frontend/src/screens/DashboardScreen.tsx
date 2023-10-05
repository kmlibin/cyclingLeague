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

import TeamList from "../components/TeamList";

const DashboardScreen: React.FC = () => {
  const { id } = useParams();
  console.log(id);
  const { data: team } = useGetSingleFantasyTeamQuery(id);
  const { data: league, refetch }: any = useGetLeagueQuery(id);
  // console.log(league);
  const { userInfo } = useAppSelector((state) => state.auth);

  //can't figure out why, but getleaguequery isn't hitting the backend on navigate, only does so if i refresh the page. this forces it
  //to fetch once it mounts. not ideal, but it's a fine patch until i can figure out why the behavior happens.
  useEffect(() => {
    refetch();
  }, []);

  console.log(userInfo);
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
        <Col>
          <Container fluid className="d-flex flex-column">
            <Row style={{ backgroundColor: "blue" }}>
              <Col>
                <TeamList data={team} />
              </Col>
            </Row>

            <Row
              className="d-flex flex-column"
              style={{ backgroundColor: "orange" }}
            >
              <Col>
                <h2>{league?.name}</h2>
              </Col>
              <Col>
                {league?.teamIds.map((team: any) => {
                  return <div key={team._id}>{team.teamName}</div>;
                })}
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardScreen;
