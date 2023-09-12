import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetCyclistsQuery } from "../slices/cyclistApiSlice";
import styled from "styled-components";
import TabsComponent from "../components/TabsComponent";
import SearchBar from "../components/SearchBar";
import Button from "react-bootstrap";

import DataTable, { TableColumn } from "react-data-table-component";

type DataRow = {
  // rank: number;
  mainSpecialty: string;
  name: string;
  team: string;
  yearEndUciPoints: number;
  cost: number;
};

//override some of the styling of react data table
const HideSelectionSummary = styled.div`
  .sc-ksJisA.da-DRew {
    display: none;
  }
  .goRgCU {
    z-index: -10;
  }
  .sc-hLclGa.sc-bqOBKd.eWcvIQ.kNUNAY.rdt_TableCol input[type="checkbox"] {
    display: none;
  }
`;

const Roster: React.FC = () => {
  const [team, setTeam] = useState<DataRow[]>([]);
  const { tab, keyword } = useParams();
  const searchObject = {
    tab: tab === "all" ? {} : tab,
    keyword: keyword ? keyword : {},
  };

  //all doesn't have a value in the db, so pass back an empty object if 'all' in order to get all riders
  const { data: cyclists, refetch } = useGetCyclistsQuery(searchObject);

  const addToTeam = (row: DataRow) => {
    setTeam((prev: DataRow[]) => [...prev, row]);
    console.log(team);
  };

  //split this off into a different file
  const getColorCircle = (mainSpecialty: string) => {
    const circleSize = "20px"; // Adjust the size as needed
    const circleStyle: React.CSSProperties = {
      width: circleSize,
      height: circleSize,
      backgroundColor: "transparent",
      borderRadius: "50%",
      display: "inline-block",
    };

    switch (mainSpecialty) {
      case "One day races":
        circleStyle.backgroundColor = "#ffa500";
        break;
      case "Sprint":
        circleStyle.backgroundColor = "#009900";
        break;
      // Add more cases for other specialties if needed
      case "Time trial":
        circleStyle.backgroundColor = "#51d5eb";
        break;
      case "Climber":
        circleStyle.backgroundColor = "#cc0000";
        break;

      default:
        circleStyle.backgroundColor = "transparent";
        break;
    }

    return <div style={circleStyle}></div>;
  };

  const columns: TableColumn<DataRow>[] = [
    // {
    //   name: "Rank",
    //   selector: (row) => row.rank,
    // },
    {
      name: "Specialty",
      maxWidth: '7%',
      selector: (row) => row.mainSpecialty,
      format: (row) => getColorCircle(row.mainSpecialty),
    },

    {
      name: "Name",
      selector: (row) => row.name,
      //encode the component because the name has spaces in it
      format: (row) => (
        <a href={`/cyclist/${encodeURIComponent(row.name)}`}>{row.name}</a>
      ),
    },
    {
      name: "Team",
      selector: (row) => row.team,
    },
    {
      name: "Points",
      selector: (row) => row.yearEndUciPoints,
      sortable: true,
    },
    {
      name: "Cost",
      selector: (row) => row.cost,
    },
    {
      name: "",
      selector: (row) => row.cost,

      format: (row) => (
        <button onClick={() => addToTeam(row)}>Add To Team</button>
      ),
    },
  ];

  useEffect(() => {
    refetch();
  }, [tab, refetch]);

  useEffect(() => {
    // Log the updated team state when it changes
    console.log("Updated Team:", team);
  }, [team]);

  return (
    <>
      <TabsComponent />
      <SearchBar />
      <HideSelectionSummary>
        <DataTable
          title="League Roster"
          columns={columns}
          data={cyclists || []}
          dense
          pagination
          highlightOnHover
          responsive
          fixedHeader
          paginationPerPage={20}
        />
      </HideSelectionSummary>
    </>
  );
};

export default Roster;
