import React from "react";
import Accordion from "react-bootstrap/Accordion";
import { DataRow } from "../types/DataRow";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import getColorCircle from '../utils/circleColor'
import {MdPerson, MdPersonRemove} from 'react-icons/md'

type Props = {
  team: DataRow[];
  points: Number;
  deleteFromTeam:  (row: DataRow) => void
};

const MyTeamDropdown: React.FC<Props> = ({ team, points, deleteFromTeam }) => {
  console.log(team);
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div className="header-content">
            <p>My Team</p>
            <div className="info">
              <p>{points.toString()} left</p>
              <p>{team.length} riders </p>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body>
            <ListGroup>
                <Row className="mb-3">Explain rules for league</Row>
            {team?.map((rider) => (
              <ListGroup.Item  className= "w-100" key={rider.name}>
                <Row className="d-flex align-items-center">
                <Col xs={1}>{getColorCircle(rider.mainSpecialty)}</Col>
                  <Col xs={5}>{rider.name}</Col>
                  <Col xs={3} className="text-end">{rider.yearEndUciPoints}</Col>
                  <Col xs={3} className="text-end">
                    <Button size="sm" variant="outline-danger" onClick={() => deleteFromTeam(rider)}><MdPersonRemove style={{fontSize: "1.5em"}}/></Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
            <ListGroup.Item className="w-100">
            <Row className="justify-content-end align-items-end">
                <Col xs="auto" className="text-end">
                Total Riders: {team.length}
                </Col>
                <Col xs="auto" className="text-end">
                Points Remaining: {points.toString()}
                </Col>
            </Row>
            </ListGroup.Item>
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default MyTeamDropdown;
