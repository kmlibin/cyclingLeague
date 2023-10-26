import React from "react";
import "./LandingScreen.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const LandingScreen = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={7} className="image-container">
          <img src="/images/table.png" alt="Your Image" />
          <div className="overlay"></div>
        </Col>
        <Col md={5} className="text-content d-flex flex-column align-items-end">
          <h1 className="text-color">The Best Riders. On Your Team.</h1>
          <p className="text-center w-75 mt-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. 
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingScreen;
