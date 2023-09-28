import React from "react";
import { useAppSelector } from "../hooks/hooks";
import { useGetSingleFantasyTeamQuery } from "../slices/fantasyTeamApiSlice";
import { useParams } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";


import TeamList from "../components/TeamList";

const DashboardScreen: React.FC = () => {
  const { id } = useParams();
  console.log(id);
  const { data: team } = useGetSingleFantasyTeamQuery(id);
  console.log(team);
  const { userInfo } = useAppSelector((state) => state.auth);
  console.log(userInfo);
  return (
    <Container fluid className="d-flex flex-row justify-content-center">
      <Row style ={{backgroundColor: 'yellow'}} xs={1} md={3}>
        <Col>
          <p>gots to say a lot of stuff</p>
        </Col>
      </Row>
      <Row  xs={1} md={9} style ={{backgroundColor: 'pink'}}>
        <Col>
          <Container fluid className="d-flex flex-column"  >
            <Row  style ={{backgroundColor: 'blue'}}>
              <Col>
                <TeamList data={team}/>
              </Col>
            </Row>
            <Row  style ={{backgroundColor: 'orange'}}>
              <Col>
                <p>adding another something</p>
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardScreen;
