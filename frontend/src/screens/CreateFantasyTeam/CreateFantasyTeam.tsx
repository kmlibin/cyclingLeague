import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

//api and redux
import { useGetCyclistsQuery } from "../../slices/cyclistApiSlice";
import { updateTeam } from "../../slices/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useCreateTeamMutation } from "../../slices/fantasyTeamApiSlice";

//libraries
import styled from "styled-components";
import { MdPersonAdd } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import CountryFlag from "react-country-flag";
import { getCode } from "country-list";
import DataTable, { TableColumn } from "react-data-table-component";
import Container from "react-bootstrap/Container";

//components
import SpecialtyTabs from "./SpecialtyTabs";
import SearchBar from "./SearchBar";
import CreateTeamDropdown from "./CreateTeamDropdown";
import Toast from "./Toast";
import Loader from "../../components/Loader";

//utils
import getColorCircle from "../../utils/circleColor";
import { calculatePrice } from "../../utils/calculateStats";
import mapNationalityName from "../../utils/findNationalityName";

//types
import { DataRow } from "../../types/DataRow";
import { TeamError } from "../../types/TeamError";
import { ToastMessage } from "../../types/ToastMessage";

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

const CreateFantasyTeam: React.FC = () => {
  const [teamError, setTeamError] = useState<TeamError>();
  const [team, setTeam] = useState<DataRow[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [pointsRemaining, setPointsRemaining] = useState<number>(150);
  const [toastMessage, setToastMessage] = useState<ToastMessage | undefined>(
    undefined
  );
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState<number>(1);
  const [createTeam, { error: createError }] = useCreateTeamMutation<any>();
  const { userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { tab, keyword } = useParams();
  const searchObject = {
    tab: tab === "all" ? {} : tab,
    keyword: keyword ? keyword : {},
    page,
    perPage,
  };

  //all doesn't have a value in the db, so pass back an empty object if 'all' in order to get all riders
  const {
    data,
    refetch,
    isLoading,
    error: dataError,
  } = useGetCyclistsQuery<any>(searchObject);

  //grab data
  const cyclists = data?.cyclists;
  const count = data?.count;

  //figure out what route user is on
  const createRoute = location.pathname.includes("/createteam");


  //reset total rows when the count changes, or when create route changes
  useEffect(() => {
    setTotalRows(count);
  }, [count, createRoute]);

  //set page to 1 when create route changes...add search object as well? 
  useEffect(() => {
    setPage(1)
  }, [createRoute, tab])

  //add rider to team
  const addToTeam = (row: DataRow) => {
    if (teamIds.includes(row._id)) {
      setTeamError({ alreadyOnTeam: "cyclist already on team", ...teamError });
      return team;
    }
    if (team.length || teamIds.length >= 25) {
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

  //delete rider from team
  const deleteFromTeam = (row: DataRow) => {
    const newTeam = team.filter((rider) => rider.name !== row.name);
    setTeamError(undefined);

    //remove from team
    setTeam(newTeam);

    //remove id from teamIds
    const newTeamIds = teamIds.filter((id) => id !== row._id);
    setTeamIds(newTeamIds);
    setPointsRemaining(pointsRemaining + calculatePrice(row.yearEndUciPoints));
  };

  //finalize team and send to DB
  const createTeamHandler = async () => {
    const confirmed = window.confirm(
      "Finalize team? You'll no longer be able to edit and any previous teams will be deleted"
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
      // make sure team has 25 people
      if (team.length !== 25) {
        setTeamError({ ...teamError, teamLength: "Must have 25 riders" });
        return;
      }
      try {
        const cyclistIds: string[] = teamIds;
        const res = await createTeam({
          cyclistIds,
          teamName,
        });

        if ("error" in res) {
          return;
        } else {
          if (typeof userInfo === "object") {
            const updatedTeamInfo = {
              cyclists: cyclistIds,
              teamName,
            };
            dispatch(updateTeam(updatedTeamInfo));
            setTeamError(undefined);
            navigate(`/users/${userInfo._id}/dashboard`);
          }
        }

        //save to local state
        //have to typecheck it for the reducer in authSlice (update team, either can have string or object)
      } catch (error) {
        console.log(error);
      }
    }
  };

  //hook up RTD to backend pagination
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handlePerRowsChange = async (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  //update the setToastMessage when points remaining and team changes
  useEffect(() => {
    setToastMessage({
      points: `${pointsRemaining}`,
      roster: `${team.length}`,
    });
  }, [pointsRemaining, team]);

  //setting data to pass into RDT
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
      maxWidth: "5%",
      right: true,
      format: (row) => {
        if (createRoute) {
          if (teamIds.includes(row._id)) {
            return (
              <ImCheckmark style={{ color: "green", fontSize: "1.7em" }} />
            );
          }
        } else {
          return null;
        }
        return (
          <button
            onClick={() => addToTeam(row)}
            style={{ backgroundColor: "white" }}
          >
            <MdPersonAdd style={{ fontSize: "1.7em" }} />
          </button>
        );
      },
    },
  ];

  useEffect(() => {
    refetch();
  }, [tab, refetch]);

  return (
    <Container className="mt-4">
      <SpecialtyTabs createRoute={createRoute} />
      {createRoute && (
        <CreateTeamDropdown
          team={team}
          points={pointsRemaining}
          deleteFromTeam={deleteFromTeam}
          createTeamHandler={createTeamHandler}
          teamName={teamName}
          setTeamName={setTeamName}
          teamError={teamError}
          createError={createError}
        />
      )}

      <SearchBar createRoute={createRoute} />
      <HideSelectionSummary>
        {isLoading && <Loader />}
        {dataError && (
          <div style={{ width: "100%", height: "100%", textAlign: "center" }}>
            {dataError?.data.msg}
          </div>
        )}
        {cyclists && (
          <DataTable
            title="Top 900 UCI Riders"
            columns={columns}
            data={cyclists || []}
            dense
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            paginationPerPage={perPage}
            highlightOnHover
            responsive
            progressPending={isLoading}
            fixedHeader
          />
        )}
      </HideSelectionSummary>
      {team.length > 0 && <Toast message={toastMessage} />}
    </Container>
  );
};

export default CreateFantasyTeam;
