import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { DataRow } from "../types/DataRow";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import getColorCircle from "../utils/circleColor";
import { MdPerson, MdPersonRemove } from "react-icons/md";
import{ calculatePrice} from "../utils/calculateStats";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";

type TeamError = {
  alreadyOnTeam?: string | undefined;
  teamLength?: string | undefined;
  teamName?: string | undefined;
  pointsUsed?: string | undefined;
};

type Props = {
  team: DataRow[];
  points: Number;
  deleteFromTeam: (row: DataRow) => void;
  createTeamHandler: () => Promise<void>;
  teamName: string;
  setTeamName: React.Dispatch<React.SetStateAction<string>>;
  teamError: TeamError | undefined;
};

const CreateTeamDropdown: React.FC<Props> = ({
  team,
  points,
  deleteFromTeam,
  createTeamHandler,
  teamName,
  setTeamName,
  teamError,
}) => {
  const pointsValue = points.valueOf();
  const [editing, setEditing] = useState(true);
  console.log(teamError);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditing(false);
  };

  const editHandler = () => {
    setEditing(true);
  };

  return (
    <Accordion defaultActiveKey="0">
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
            <Row className="mb-3">Explain rules for league</Row>
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
                  Total Riders: <strong>{team.length}</strong>
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
