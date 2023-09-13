import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetCyclistsQuery } from "../slices/cyclistApiSlice";
import styled from "styled-components";
import TabsComponent from "../components/TabsComponent";
import SearchBar from "../components/SearchBar";
import MyTeamDropdown from "../components/MyTeamDropdown";
import getColorCircle from "../utils/circleColor";
import { MdPersonAdd } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import calculatePrice from "../utils/calculatePoints";

import DataTable, { TableColumn } from "react-data-table-component";

type DataRow = {
  // rank: number;
  mainSpecialty: string;
  name: string;
  team: string;
  yearEndUciPoints: number;
  price: number;
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
  const [pointsRemaining, setPointsRemaining] = useState<number>(150);
  const { tab, keyword } = useParams();
  const searchObject = {
    tab: tab === "all" ? {} : tab,
    keyword: keyword ? keyword : {},
  };

  //all doesn't have a value in the db, so pass back an empty object if 'all' in order to get all riders
  const { data: cyclists, refetch } = useGetCyclistsQuery(searchObject);

  const addToTeam = (row: DataRow) => {
    if (team.includes(row)) {
      return team;
      //send error
    }
    if (team.length >= 25) {
      return team;
      //send error
    }
    if (pointsRemaining - calculatePrice(row.yearEndUciPoints) <= 0) {
      return pointsRemaining;
      //send error
    } else {
      setTeam([...team, row]);
      //I don't have a 'price' on my data, so i have to access year end uci points and put it through calculate Price
      setPointsRemaining(
        pointsRemaining - calculatePrice(row.yearEndUciPoints)
      );
    }
  };

  const deleteFromTeam = (row: DataRow) => {
    const newTeam = team.filter((rider) => rider.name !== row.name);
    setTeam(newTeam);
    setPointsRemaining(pointsRemaining + calculatePrice(row.yearEndUciPoints));
  };

  const columns: TableColumn<DataRow>[] = [
    {
      name: "Specialty",
      maxWidth: "7%",
      selector: (row) => row.mainSpecialty,
      format: (row) => getColorCircle(row.mainSpecialty),
    },
    {
      name: "Rank",
      maxWidth: "7%",
      selector: (row) => 1,
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
      maxWidth: "10%",
      selector: (row) => row.yearEndUciPoints,
      sortable: true,
    },
    {
      name: "Price",
      maxWidth: "10%",
      selector: (row) => calculatePrice(row.yearEndUciPoints),
    },
    {
      name: "",
      selector: (row) => row.mainSpecialty,
      maxWidth: "15%",
      right: true,
      format: (row) => {
        if (team.includes(row)) {
          return <ImCheckmark style={{ color: "green", fontSize: "1.7em" }} />;
        } else {
          return (
            <button
              onClick={() => addToTeam(row)}
              style={{ backgroundColor: "white" }}
            >
              <MdPersonAdd style={{ fontSize: "1.7em" }} />
            </button>
          );
        }
      },
    },
  ];

  useEffect(() => {
    refetch();
  }, [tab, refetch]);

  useEffect(() => {
    // Log the updated team state when it changes
    console.log("Updated Team:", team, pointsRemaining);
  }, [team, pointsRemaining]);

  return (
    <>
      <TabsComponent />
      <MyTeamDropdown
        team={team}
        points={pointsRemaining}
        deleteFromTeam={deleteFromTeam}
      />
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
