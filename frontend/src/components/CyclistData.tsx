import React from "react";
import { Link } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import mapNationalityName from "../utils/findNationalityName";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import { Cyclist } from "../interfaces/Cyclist";
import { BsStarFill } from "react-icons/bs";
import PieChartComponent from "../components/PieChartComponent";
import SocialMedia from "../components/SocialMedia";
import CountryFlag from "react-country-flag";
import { getCode } from "country-list";
import { useAppSelector } from "../hooks/hooks";
import { LinkContainer } from "react-router-bootstrap";
type Props = {
  cyclistData: Cyclist | any;
  isMyTeam?: boolean;

};

type SharedRiders = {
  sharedRiders : Cyclist[],
  user: string;
}



const CyclistData: React.FC<Props> = ({ cyclistData: rider, isMyTeam }) => {
  const { sharedRiders } = useAppSelector((state): SharedRiders => state.sharedRiders);

  const countryCode = getCode(mapNationalityName(rider.nationalityName));


  const sharedCyclists = sharedRiders || [];
  console.log(sharedCyclists)
  //check if the current rider is in the shared cyclists array by comparing their ids. if so, will conditionally render 
  //"on my team" below
  const shared = sharedCyclists.some(
    (sharedRider: Cyclist) => sharedRider._id === rider._id
  );
  console.log(shared)

  

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
          {!isMyTeam && shared && (
            <ListGroup.Item
              className="d-flex justify-content-center align-items-center"
              style={{ backgroundColor: "lightskyblue" }}
            >
              <span className="d-flex justify-content-start align-items-center">
                <BsStarFill style={{ color: "purple" }} /> &nbsp; On My Team
              </span>
            </ListGroup.Item>
          )}
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
