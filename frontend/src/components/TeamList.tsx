import React from "react";

import { FantasyTeam } from "../interfaces/Cyclist";
import DataTable, { TableColumn } from "react-data-table-component";
import getColorCircle from "../utils/circleColor";
import calculatePrice from "../utils/calculatePoints";
type Props = {
  data: FantasyTeam;
};

type DataRow = {
  mainSpecialty: string;
  name: string;
  team: string;
  currentRank: string;
  yearEndUciPoints: number,
  currentUciPoints: number,
  _id: string;
};

const TeamList: React.FC<Props> = ({ data }) => {
  const columns: TableColumn<DataRow>[] = [
    {
      name: "Specialty",
        width: "90px",
      selector: (row) => row.mainSpecialty,
      format: (row) => getColorCircle(row.mainSpecialty),
    },
    {
      name: "Rank",
      selector: (row) => row.currentRank,
    },

    {
      name: "Name",
      width: "25%",
      selector: (row) => row.name,
      //encode the component because the name has spaces in it
      format: (row) => (
        <a href={`/cyclist/${encodeURIComponent(row.name)}`}>{row.name}</a>
      ),
    },
    {
      name: "Team",
      minWidth: "25%",
      selector: (row) => row.team,
    },
    {
      name: "Price",
      right: true,
      selector: (row) => calculatePrice(row.yearEndUciPoints),
    },
    {
      name: "Current Points",
      width: "115px",
   right: true,
      selector: (row) => Math.round(row.currentUciPoints),
    },
  ];

  console.log(data);
  return (
    <DataTable
      title={data?.teamName}
      columns={columns}
      data={data?.cyclists || []}
      dense
      pagination
      highlightOnHover
      responsive
      fixedHeader
      paginationPerPage={10}
    />
  );
};

export default TeamList;
