import React from "react";
import { Link } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Cyclist } from "../interfaces/Cyclist";

import PieChartComponent from "../components/PieChartComponent";
import SocialMedia from "../components/SocialMedia";
import CountryFlag from "react-country-flag";
import { getCode } from "country-list";

type Props = {
  cyclistData: Cyclist;
};

const CyclistData: React.FC<Props> = ({ cyclistData: rider }) => {
  const countryCode = getCode(rider.nationalityName);
  console.log(countryCode);

  return (
    <Card bg="light" className="m-1" style={{ width: "30%" }}>
      <Card.Body>
        <Card.Title className="text-center">
          <h2>{rider.name}</h2>
        </Card.Title>
        <Card.Text className="text-center pb-2 d-flex align-items-center justify-content-center">
          <strong>Country:&nbsp;</strong>
          {rider.nationalityName}&nbsp;
          <CountryFlag countryCode={countryCode ? countryCode : "none"} svg />
        </Card.Text>
        <div
          className="d-flex justify-content-center align-items-center mb-4"
          style={{ backgroundColor: "lightgrey", borderRadius: "5px" }}
        >
          <Card.Img
            style={{ width: "45%", height: "auto" }}
            src={rider.imageSrc}
          />
        </div>
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
            className="pb-5"
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
      </Card.Body>
    </Card>
  );
};

export default CyclistData;
