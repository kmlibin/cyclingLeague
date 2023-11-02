import React from "react";

//interfaces and types
import { DataRow } from "../../types/DataRow";
import { FantasyTeam } from "../../interfaces/FantasyTeam";

//libraries
import DataTable, { TableColumn } from "react-data-table-component";
import mapNationalityName from "../../utils/findNationalityName";
import { getCode } from "country-list";
import CountryFlag from "react-country-flag";

//utils
import getColorCircle from "../../utils/circleColor";
import { calculatePrice } from "../../utils/calculateStats";

type Props = {
  data: FantasyTeam;
};

const MyFantasyTeamTable: React.FC<Props> = ({ data }) => {
  const columns: TableColumn<DataRow>[] = [
    {
      name: "Specialty",
      selector: (row) => row.mainSpecialty,
      format: (row) => getColorCircle(row.mainSpecialty),
    },
    {
      name: "Rank",
      sortable: true,
      selector: (row) => {
        return row.currentRank === "n/a" ? "n/a" : Number(row.currentRank);
      },
    },

    {
      name: "Name",
      width: "25%",
      selector: (row) => row.name,
      //encode the component because the name has spaces in it
      format: (row) => (
        <>
          <CountryFlag
            alt={`${row.nationalityName} flag`}
            countryCode={
              getCode(mapNationalityName(row.nationalityName)) || "none"
            }
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
      sortable: true,
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
      defaultSortFieldId={2}
      columns={columns}
      data={data?.cyclists || []}
      dense
      pagination
      highlightOnHover
      responsive
      fixedHeader
      paginationPerPage={25}
    />
  );
};

export default MyFantasyTeamTable;
