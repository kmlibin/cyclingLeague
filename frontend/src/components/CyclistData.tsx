import React from "react";
import { Link } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Cyclist } from "../interfaces/Cyclist";

import PieChartComponent from "../components/PieChartComponent";
import SocialMedia from "../components/SocialMedia";

type Props = {
  cyclistData: Cyclist;
};

const CyclistData: React.FC<Props> = ({ cyclistData: rider }) => {
  return (
    <Container
      key={rider._id}
      fluid="md"
      className="d-flex flex-column"
      style={{ backgroundColor: "beige" }}
    >
      <Row className="d-flex justify-content-center py-2">
        <Col md={3}>
          <Card bg="light" border="dark">
            <Card.Title className="text-center">
              <h2>{rider.name}</h2>
            </Card.Title>
            <ListGroup.Item className="text-center pb-2">
              <strong>Country: </strong>
              {rider.nationalityName}
            </ListGroup.Item>
            <Card.Img src={rider.imageSrc} />
          </Card>
        </Col>
        <Col md={4} xl={3}>
          <Card border="dark">
            <ListGroup>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Main Specialty: </strong>
                  </Col>
                  <Col>{rider.mainSpecialty}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Team: </strong>
                  </Col>
                  <Col>
                    <Link to={`/teams/${rider.team}`}>{rider.team}</Link>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item
                className="pb-4"
                style={{ backgroundColor: "#f8f8f8" }}
              >
                <PieChartComponent specialties={rider.riderSpecialties} />
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <SocialMedia socialUrls={rider.socialUrls} />
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CyclistData;
