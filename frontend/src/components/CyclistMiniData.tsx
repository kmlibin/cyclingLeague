import React from "react";
import { Cyclist } from "../interfaces/Cyclist";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";

type CyclistMiniDataProps = {
  cyclistData: Cyclist | null;
};

const CyclistMiniData: React.FC<CyclistMiniDataProps> = ({ cyclistData }) => {
  return (
    <Card className="d-flex flex-row justify-content-center align-items-center w-100">
      <Col className="d-flex justify-content-center align-items-center">
        <Card.Img
          style={{ height: "175px", width: "125px", borderRadius: "50%", marginTop: "1rem", marginBottom: "1rem" }}
          src={cyclistData?.imageSrc}
        />
      </Col>
      <Col>
        <Card.Body>
          <Card.Title>{cyclistData?.name}</Card.Title>
          <br></br>
          <Card.Text className="mb-1">
            <b>Country:</b>&nbsp;{cyclistData?.nationalityName}
          </Card.Text>
          <Card.Text className="mb-1">
            <b>Current Rank:</b>&nbsp;{cyclistData?.currentRank}
          </Card.Text>
          <Card.Text className="mb-1">
            <b>Specialty:</b> &nbsp;
            {cyclistData?.mainSpecialty}
          </Card.Text>
        </Card.Body>
      </Col>
    </Card>
  );
};

export default CyclistMiniData;
