import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";

//bootstrap
import Nav from "react-bootstrap/Nav";

const SpecialtyTabs: React.FC = () => {
  const navigate = useNavigate();
  const {keyword: search} = useParams();

  const [keyword, setSearch] = useState(search || "");

  useEffect(() => {
    setSearch(search || ""); // Update the search state when URL changes
  }, [search]);

  const handleClick = (tab: string | undefined) => {
    if (keyword.trim()) {
      const route = tab ? `/cyclists/${tab}/search/${keyword}` : `/cyclists/search/${keyword}`;
      navigate(route);
    } else {
      const route = tab ? `/cyclists/${tab}/search` : "/";
      navigate(route);
    }
  };

  return (
    <Nav variant="tabs" justify>
      <Nav.Item
        className="navtabs"
        onClick={() => handleClick("all")}
        style={{ backgroundColor: "rgba(103, 81, 235, .65)" }}
      >
        <Nav.Link eventKey="all">All</Nav.Link>
      </Nav.Item>
      <Nav.Item
        className="navtabs"
        onClick={() => handleClick("Climber")}
        style={{ backgroundColor: "rgba(265, 165, 0, .65" }}
      >
        <Nav.Link eventKey="climbers">Climbers</Nav.Link>
      </Nav.Item>
      <Nav.Item
        className="navtabs"
        onClick={() => handleClick("One day races")}
        style={{ backgroundColor: "rgba(204, 0,0, .65" }}
      >
        <Nav.Link eventKey="one day">One Day Specialists</Nav.Link>
      </Nav.Item>
      <Nav.Item
        className="navtabs"
        onClick={() => handleClick("Time trial")}
        style={{ backgroundColor: "rgba(81, 213, 235, .65)" }}
      >
        <Nav.Link eventKey="time trial">Time Trial</Nav.Link>
      </Nav.Item>
      <Nav.Item
        className="navtabs"
        onClick={() => handleClick("Sprint")}
        style={{ backgroundColor: "rgba(0, 153, 0, .65" }}
      >
        <Nav.Link eventKey="sprinters">Sprinters</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default SpecialtyTabs;
