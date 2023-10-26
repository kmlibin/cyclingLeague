import React from "react";
import { Link } from "react-router-dom";
import "./LandingScreen.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import { MdOutlineDirectionsBike } from "react-icons/md";

const LandingScreen = () => {
  return (
    <Container fluid>
      <Row>
        <Col md={7} className="image-container">
          <img src="/images/table2.png" alt="Your Image" />
          <div className="overlay"></div>
        </Col>
        <Col
          md={5}
          className="text-content d-flex flex-column align-items-end justify-content-center"
        >
          <h1 className="text-color">
            The Best Cyclists. <br></br>On Your Team.
          </h1>
          <div className="d-flex flex-column align-items-end w-75 mt-4">
            <p className="text-end">
              Unlock the thrill of fantasy cycling by joining us today! Dive
              into a world of excitement as you handpick your dream team from a
              pool of 900 top cycling professionals. Ready to take it up a notch? Create your
              very own league and invite fellow fantasy teams to battle it out
              for the ultimate cycling supremacy! Are you up for the challenge?
            </p>
            <LinkContainer className="w-50" to="/register">
              <Button className="button-style" size="lg">
                Sign Up Now
              </Button>
            </LinkContainer>
          </div>
          <p className="bottom">
            Already have an account? Login{" "}
            <Link
              to="/login"
              style={{ color: "rgb(14, 121, 213)", textDecoration: "none" }}
            >
              here
            </Link>
            <MdOutlineDirectionsBike
              style={{ color: "rgb(114, 216, 5)", marginLeft: ".5rem" }}
            />
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default LandingScreen;
