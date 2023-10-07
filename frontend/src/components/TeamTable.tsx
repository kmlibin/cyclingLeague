import React from "react";

import { FantasyTeam } from "../interfaces/Cyclist";
import DataTable, { TableColumn } from "react-data-table-component";
import getColorCircle from "../utils/circleColor";
import calculatePrice from "../utils/calculatePoints";
import { getCode } from "country-list";
import CountryFlag from "react-country-flag";
type Props = {
  data: FantasyTeam;
};

type DataRow = {
  mainSpecialty: string;
  name: string;
  team: string;
  currentRank: string;
  yearEndUciPoints: number;
  currentUciPoints: number;
  nationalityName: string;
  _id: string;
};

const TeamTable: React.FC<Props> = ({ data }) => {
  const columns: TableColumn<DataRow>[] = [
    {
      name: "Specialty",

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
        <>
          <CountryFlag
            countryCode={getCode(row.nationalityName) || "none"}
            svg
          />
          &nbsp;
          <a href={`/cyclist/${encodeURIComponent(row.name)}`}>{row.name}</a>
        </>
      ),
    },
    {
      name: "Team",
      width: "20%",
      selector: (row) => row.team,
    },
    {
      name: "Price",
      right: true,
      selector: (row) => calculatePrice(row.yearEndUciPoints),
    },
    {
      name: "Current Points",

      right: true,
      selector: (row) => Math.round(row.currentUciPoints),
    },
  ];

  return (
    <DataTable
      // title={data?.teamName}
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

export default TeamTable;
