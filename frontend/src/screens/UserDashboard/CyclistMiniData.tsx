import React from "react";
import { Cyclist } from "../../interfaces/Cyclist";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";

type CyclistMiniDataProps = {
  cyclistData: Cyclist | null;
};


const CyclistMiniData: React.FC<CyclistMiniDataProps> = ({ cyclistData }) => {
  console.log(cyclistData)
  return (
    <Card className="d-flex flex-row justify-content-center align-items-center w-100" style={{boxShadow: "0 4px 6px rgba(0,0,0,.2"}}>
      <Col className="d-flex justify-content-center align-items-center">
        <Card.Img
          style={{
            height: "175px",
            width: "125px",
            borderRadius: "50%",
            marginTop: "1rem",
            marginBottom: "1rem",
          }}
          src={cyclistData?.imageSrc}
        />
      </Col>
      <Col>
        <Card.Body>
          <Card.Title className="mb-1 p-1" style={{backgroundColor: "#D17C58"}}>{cyclistData?.name}</Card.Title>
          <Card.Text className="mb-1 p-1" style={{backgroundColor: "#D68F6D"}}>
            <b>Country:</b>&nbsp;{cyclistData?.nationalityName}
          </Card.Text>
          <Card.Text className="mb-1 p-1" style={{backgroundColor: "#DCA281"}}>
            <b>Specialty:</b> &nbsp;
            {cyclistData?.mainSpecialty}
          </Card.Text>
          <Card.Text className="mb-1 p-1" style={{backgroundColor: "#E1B595"}}>
            <b>Rank:</b>&nbsp;{cyclistData?.currentRank}
          </Card.Text>
          <Card.Text className="mb-1 p-1" style={{backgroundColor: "#E6C8AA"}}>
            <b>Points:</b> &nbsp;
            {cyclistData?.currentUciPoints}
          </Card.Text>
        </Card.Body>
      </Col>
    </Card>
  );
};

export default CyclistMiniData;
