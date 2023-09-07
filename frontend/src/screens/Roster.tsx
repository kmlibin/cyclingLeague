import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetCyclistsQuery } from "../slices/cyclistApiSlice";
import { Cyclist } from "../interfaces/Cyclist";
import styled from "styled-components";
import TabsComponent from "../components/TabsComponent";

import DataTable, { TableColumn } from "react-data-table-component";

type DataRow = {
  // rank: number;
  mainSpecialty: string;
  name: string;
  team: string;
  yearEndUciPoints: number;
  cost: number;
};

const columns: TableColumn<DataRow>[] = [
  // {
  //   name: "Rank",
  //   selector: (row) => row.rank,
  // },
  {
    name: "Specialty",
    selector: (row) => row.mainSpecialty,
  },
  {
    name: "Name",
    selector: (row) => row.name,
  },
  {
    name: "Team",
    selector: (row) => row.team,
  },
  {
    name: "Points",
    selector: (row) => row.yearEndUciPoints,
  },
  {
    name: "Cost",
    selector: (row) => row.cost,
  },
];

type Props = {};

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

const Roster = (props: Props) => {
  const { tab } = useParams();
  console.log(tab);
  //all doesn't have a value in the db, so pass back an empty object if 'all' in order to get all riders
  const { data: cyclists, refetch } = useGetCyclistsQuery(tab === 'all' ? {} : tab);
  const handleChange = ({ selectedRows }: { selectedRows: DataRow[] }) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ");
  };

  useEffect(() => {
    refetch();
  }, [tab, refetch]);

  return (
    <>
      <TabsComponent />
      <HideSelectionSummary>
        <DataTable
          title="League Roster"
          columns={columns}
          data={cyclists || []}
          selectableRows
          onSelectedRowsChange={handleChange}
          dense
          pagination
          paginationPerPage={20}
        />
      </HideSelectionSummary>
    </>
  );
};

export default Roster;
