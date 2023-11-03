import React, { useState } from "react";

//bootstrap and other libraries
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";

import { MdPersonRemove } from "react-icons/md";

//types and interfaces
import { DataRow } from "../../types/DataRow";
import { TeamError } from "../../types/TeamError";

//utils
import getColorCircle from "../../utils/circleColor";
import { calculatePrice } from "../../utils/calculateStats";


type Props = {
  team: DataRow[];
  points: Number;
  deleteFromTeam: (row: DataRow) => void;
  createTeamHandler: () => Promise<void>;
  teamName: string;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
  teamError: TeamError | undefined;
  createError: any;
};

const CreateTeamDropdown: React.FC<Props> = ({
  team,
  points,
  deleteFromTeam,
  createTeamHandler,
  teamName,
  setTeamName,
  teamError,
  createError,

}) => {
  const pointsValue = points.valueOf();
  const [editing, setEditing] = useState(true);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditing(false);
  };

  const editHandler = () => {
    setEditing(true);
  };


  return (
    <Accordion defaultActiveKey="0" className="mt-2">
      <Accordion.Item eventKey="0">
        <Accordion.Header className="text-xs">
          <div className="header-content">
            <p>{teamName}</p>
            <div className="info">
              <p>{150 - pointsValue}/150 points</p>
              <p>{team.length} riders </p>
            </div>
          </div>
        </Accordion.Header>
        <Accordion.Body>
          <ListGroup>
            <ListGroup.Item>
              <Row className="mb-3">
                <li>
                  Each user can only have <b>one</b> team
                </li>
                <li>You must have 25 riders</li>
                <li>You must submit a teamname</li>
                <li>You cannot use more than 150 points</li>
              </Row>
            </ListGroup.Item>
            {team?.map((rider) => (
              <ListGroup.Item className="w-100" key={rider.name}>
                <Row className="d-flex align-items-center">
                  <Col xs={1}>{getColorCircle(rider.mainSpecialty)}</Col>
                  <Col xs={5}>{rider.name}</Col>
                  <Col xs={3} className="text-end">
                    {calculatePrice(rider.yearEndUciPoints)}
                  </Col>
                  <Col xs={3} className="text-end">
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => deleteFromTeam(rider)}
                    >
                      <MdPersonRemove style={{ fontSize: "1.5em" }} />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
            <ListGroup.Item className="w-100">
              <Row className="justify-content-end align-items-end">
                <Col xs="auto" className="text-end">
                  Points Remaining: <strong>{points.toString()}</strong>
                </Col>
                <Col xs="auto" className="text-end">
                  Total Riders: <strong>{team.length} / 25</strong>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className="text-end">
              <Row>
                {editing ? (
                  <Col xs={8}>
                    <Form onSubmit={submitHandler} className="d-flex">
                      <Form.Group style={{ marginRight: "10px" }}>
                        <Form.Control
                          type="text"
                          placeholder="Enter Your Team Name"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      {teamError?.teamName ? (
                        <Button variant="danger" type="submit">
                          Submit Team Name
                        </Button>
                      ) : (
                        <Button variant="info" type="submit">
                          Submit Team Name
                        </Button>
                      )}
                    </Form>
                  </Col>
                ) : (
                  <Col className="d-flex">
                    <Badge
                      bg="dark"
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        marginRight: "10px",
                        minWidth: "20%",
                        fontSize: "18px",
                      }}
                    >
                      {teamName}
                    </Badge>
                    {teamName ? (
                      <Button variant="info" onClick={editHandler}>
                        Edit Team Name
                      </Button>
                    ) : (
                      <Button variant="info" onClick={editHandler}>
                        Submit Team Name
                      </Button>
                    )}
                  </Col>
                )}

                <Col xs={4}>
                  <Button variant="info" onClick={createTeamHandler}>
                    Finalize Team
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
            {createError && (
              <ListGroup.Item>
                <Row className="w-100 d-flex justify-content-end error">
                  {createError?.data.msg}
                </Row>
              </ListGroup.Item>
            )}
            {teamError && (
              <ListGroup.Item>
                <Row className="w-100 d-flex justify-content-end error">
                  {teamError.pointsUsed}
                </Row>
                <Row className="w-100 d-flex justify-content-end error ">
                  {teamError.alreadyOnTeam}
                </Row>
                <Row className="w-100 d-flex justify-content-end error ">
                  {teamError.teamLength}
                </Row>
              </ListGroup.Item>
            )}
          </ListGroup>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default CreateTeamDropdown;
