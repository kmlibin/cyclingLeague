import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetCyclistsQuery } from "../slices/cyclistApiSlice";
import styled from "styled-components";
import TabsComponent from "../components/TabsComponent";
import SearchBar from "../components/SearchBar";
import MyTeamDropdown from "../components/MyTeamDropdown";
import getColorCircle from "../utils/circleColor";
import { MdPersonAdd } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import { updateTeam } from "../slices/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import calculatePrice from "../utils/calculatePoints";
import { useCreateTeamMutation } from "../slices/fantasyTeamApiSlice";
import mapNationalityName from "../utils/findNationalityName";
import CountryFlag from "react-country-flag";
import { getCode } from "country-list";
import Spinner from "react-bootstrap/Spinner";

import DataTable, { TableColumn } from "react-data-table-component";

type DataRow = {
  // rank: number;
  mainSpecialty: string;
  name: string;
  team: string;
  yearEndUciPoints: number;
  price: number;
  _id: string;
  prevYearRank: string;
  nationalityName: string;
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

type TeamError = {
  alreadyOnTeam?: string | undefined;
  teamLength?: string | undefined;
  teamName?: string | undefined;
  pointsUsed?: string | undefined;
  serverError?: string | undefined;
};

const Roster: React.FC = () => {
  const [teamError, setTeamError] = useState<TeamError>();
  const [team, setTeam] = useState<DataRow[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [pointsRemaining, setPointsRemaining] = useState<number>(150);
  const [createTeam, { error }] = useCreateTeamMutation();
  const { userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { tab, keyword } = useParams();
  const searchObject = {
    tab: tab === "all" ? {} : tab,
    keyword: keyword ? keyword : {},
  };

  //all doesn't have a value in the db, so pass back an empty object if 'all' in order to get all riders
  const {
    data: cyclists,
    refetch,
    isLoading,
  } = useGetCyclistsQuery(searchObject);

  const addToTeam = (row: DataRow) => {
    if (team.includes(row)) {
      setTeamError({ alreadyOnTeam: "cyclist already on team", ...teamError });
      return team;
    }
    if (team.length >= 25) {
      setTeamError({
        teamLength: "Team Is Full",
        ...teamError,
      });
      return team;
    }
    if (pointsRemaining - calculatePrice(row.yearEndUciPoints) < 0) {
      setTeamError({ pointsUsed: "Not enough points available", ...teamError });
      return team;
    } else {
      setTeamError(undefined);
      setTeam([...team, row]);
      setTeamIds([...teamIds, row._id]);
      //I don't have a 'price' on my data, so i have to access year end uci points and put it through calculate Price
      setPointsRemaining(
        pointsRemaining - calculatePrice(row.yearEndUciPoints)
      );
    }
  };

  const deleteFromTeam = (row: DataRow) => {
    const newTeam = team.filter((rider) => rider.name !== row.name);
    setTeamError(undefined);
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
      selector: (row) => {
        return row.prevYearRank === "n/a" ? 0 : Number(row.prevYearRank);
      },
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      //encode the component because the name has spaces in it
      format: (row) => (
        <>
          <CountryFlag
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
      selector: (row) => row.team,
    },
    {
      name: "Points",
      maxWidth: "10%",
      selector: (row) => Number(row.yearEndUciPoints),
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

  const createTeamHandler = async () => {
    const confirmed = window.confirm(
      "Finalize team? You'll no longer be able to edit..."
    );
    if (confirmed) {
      //check for teamname
      if (!teamName) {
        setTeamError({
          ...teamError,
          teamName: "Please submit a name for your team",
        });
        return;
      }
      //make sure team has 25 people
      if (team.length != 25) {
        setTeamError({ ...teamError, teamLength: "Must have 25 riders" });
        return;
      }
      try {
        const cyclistIds: string[] = teamIds;
        const res = await createTeam({
          cyclistIds,
          teamName,
        });

        //save to local state
        //have to typecheck it for the reducer in authSlice (update team, either can have string or object)
        if (typeof userInfo === "object") {
          const updatedTeamInfo = {
            cyclists: cyclistIds,
            teamName,
          };
          dispatch(updateTeam(updatedTeamInfo));
          setTeamError(undefined);
          navigate(`/users/${userInfo._id}/dashboard`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    refetch();
  }, [tab, refetch]);

  return (
    <>
      <TabsComponent />
      <MyTeamDropdown
        team={team}
        points={pointsRemaining}
        deleteFromTeam={deleteFromTeam}
        createTeamHandler={createTeamHandler}
        teamName={teamName}
        setTeamName={setTeamName}
        teamError={teamError}
      />
      <SearchBar />
      <HideSelectionSummary>
        {isLoading && (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
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
