import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";


function SpecialtyTabs() {
  const navigate = useNavigate();

  const handleClick = (tab: string | undefined) => {
    navigate(`/riders/${tab}`);
  };

  return (
    <Nav variant="tabs"  justify>
      <Nav.Item onClick = {() => handleClick('all')}>
        <Nav.Link eventKey="all">All</Nav.Link>
      </Nav.Item>
      <Nav.Item onClick = {() => handleClick('Climber')}>
        <Nav.Link eventKey="climbers">Climbers</Nav.Link>
      </Nav.Item>
      <Nav.Item onClick = {() => handleClick('One day races')}>
        <Nav.Link eventKey="one day">One Day Specialists</Nav.Link>
      </Nav.Item>
      <Nav.Item onClick = {() => handleClick('Time trial')}>
        <Nav.Link eventKey="time trial">Time Trial</Nav.Link>
      </Nav.Item>
      <Nav.Item onClick = {() => handleClick('Sprint')}>
        <Nav.Link eventKey="sprinters">Sprinters</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default SpecialtyTabs;
