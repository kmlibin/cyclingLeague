import React from "react";
import { useParams } from "react-router-dom";
//libraries
import { getCode } from "country-list";
import CountryFlag from "react-country-flag";
//bootstrap
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { LinkContainer } from "react-router-bootstrap";
//api and redux
import { useGetTeamsQuery } from "../../slices/cyclistApiSlice";
//components
import TeamList from "../../components/TeamList";
import Paginate from "../../components/Paginate";
//data for team badges
import worldTourTeams from "./worldTourTeams.json";



const AllTeamsScreen = () => {
  const { pageNumber } = useParams();
  const { data } = useGetTeamsQuery({ pageNumber });

  return (
    <>
      <Row className="text-center m-4">
        <h2>2022 World Tour Teams</h2>
        <p className="attention">*since only 900 riders are present in the database, it's likely many teams are missing some riders*</p>
      </Row>
      <div className="d-flex w-100 flex-wrap justify-content-center align-items-center">
        {worldTourTeams.map((team) => (
          <Card key={team.name} style={{ width: "32%" }} className="m-2">
            <div className="d-flex align-items-center">
              <Card.Img
                src={team.img}
                style={{ height: "60px", width: "60px" }}
              />
              <Card.Body>
                <LinkContainer to={`/teams/${team.name}`}>
                  <Card.Text className="onHover">
                    {team.name}
                    <span style={{ marginLeft: "10px", marginRight: "10px" }}>
                      <CountryFlag
                        countryCode={getCode(team.country) || "none"}
                        svg
                      />
                    </span>
                  </Card.Text>
                </LinkContainer>
              </Card.Body>
            </div>
          </Card>
        ))}
      </div>
      <ListGroup as="ol" className="d-flex align-items-center">
        <Row className="text-center m-4">
          <h2>2022 Teams</h2>
        </Row>
        {data?.teamRoster?.map((team: any) => (
          <TeamList
            key={team._id}
            team={team}
            teamName={team._id}
            url={`/teams/${team._id}`}
          />
        ))}
      </ListGroup>
      <div className="d-flex justify-content-center mt-3">
        <Paginate pages={data?.pages} page={data?.page} />
      </div>
    </>
  );
};

export default AllTeamsScreen;
