import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";
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
  yearEndUciPoints: number;
  _id: string;
};

const TeamList: React.FC<Props> = ({ data }) => {
  const columns: TableColumn<DataRow>[] = [
    {
      name: "Specialty",
      //   width: "90px",
      selector: (row) => row.mainSpecialty,
      format: (row) => getColorCircle(row.mainSpecialty),
    },
    {
      name: "Rank",
      //   maxWidth: "7%",
      selector: (row) => 1,
    },

    {
      name: "Name",
      width: "165px",
      selector: (row) => row.name,

      //encode the component because the name has spaces in it
      format: (row) => (
        <a href={`/cyclist/${encodeURIComponent(row.name)}`}>{row.name}</a>
      ),
    },
    {
      name: "Team",
      minWidth: "20%",
      selector: (row) => row.team,
    },
    {
      name: "Points",

      selector: (row) => row.yearEndUciPoints,
      sortable: true,
    },
    {
      name: "Price",

      selector: (row) => calculatePrice(row.yearEndUciPoints),
    },
    {
      name: "Current Points",
      width: "115px",
      selector: (row) => 5,
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
      //   responsive
      fixedHeader
      paginationPerPage={10}
    />
  );
};

export default TeamList;
