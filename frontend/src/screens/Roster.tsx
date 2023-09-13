import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetCyclistsQuery } from "../slices/cyclistApiSlice";
import styled from "styled-components";
import TabsComponent from "../components/TabsComponent";
import SearchBar from "../components/SearchBar";
import MyTeamDropdown from "../components/MyTeamDropdown";
import getColorCircle from "../utils/circleColor";
import {MdPersonAdd} from 'react-icons/md'
import {ImCheckmark} from 'react-icons/im'

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
  const [pointsSpent, setPointsSpent] = useState<Number>(0);
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
    } else {
      setTeam([...team, row]);
      setPointsSpent(Number(pointsSpent) + Number(row.yearEndUciPoints / 100));
    }
  };

  const deleteFromTeam = (row: DataRow) => {
    const newTeam = team.filter((rider) => rider.name !== row.name)
    setTeam(newTeam)
    //need to set points
  }



  const columns: TableColumn<DataRow>[] = [
    // {
    //   name: "Rank",
    //   selector: (row) => row.rank,
    // },
    {
      name: "Specialty",
      maxWidth: "7%",
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
      selector: (row) => row.yearEndUciPoints / 100,
    },
    {
      name: "",
      selector: (row) => row.cost,
      right: true,
      format: (row) => {
        if (team.includes(row)) {
          return <ImCheckmark style={{color: 'green', fontSize: "1.7em"}}/>;
        } else {
          return <button onClick={() => addToTeam(row)} style={{backgroundColor: 'white'}}><MdPersonAdd style={{ fontSize: "1.7em"}} /></button>;
        }
      },
    },
  ];

  useEffect(() => {
    refetch();
  }, [tab, refetch]);

  useEffect(() => {
    // Log the updated team state when it changes
    console.log("Updated Team:", team, pointsSpent);
  }, [team, pointsSpent]);

  return (
    <>
      <TabsComponent />
      <MyTeamDropdown team = {team} points= {pointsSpent} deleteFromTeam={deleteFromTeam}/>
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
