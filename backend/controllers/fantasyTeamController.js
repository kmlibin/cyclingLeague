import FantasyTeam from "../models/FantasyTeam.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";

//@desc create team
//@route POST /api/fantasyteam
//@access Public
const createTeam = async (req, res) => {
  const { cyclistIds, teamName } = req.body;
  const owner = req.user._id;

  //if team is not 25 ids, throw error

  const team = new FantasyTeam({
    owner,
    cyclists: cyclistIds,
    teamName,
  });
  const createdTeam = await team.save();

  // update the user's myTeam field
  await User.findByIdAndUpdate(owner, { myTeam: createdTeam._id });
  console.log(createdTeam);
  res.status(StatusCodes.CREATED).json({ createdTeam });
};

//@desc fetch single teams
//@route GET /api/fantasyteam/:userId
//@access Public

const getSingleFantasyTeam = async (req, res) => {
  const { userId } = req.params;

  try {
    const fantasyTeam = await FantasyTeam.findOne({ owner: userId }).populate(
      "cyclists"
    );
    if (!fantasyTeam) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: "no team with that name" });
    }
    res.status(StatusCodes.OK).json(fantasyTeam);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};

//@desc fetch single teams BY THEIR IDS
//@route GET /api/fantasyteam/teams/:teamId
//@access Public

const getSingleFantasyTeamById = async (req, res) => {
  const { teamId } = req.params;
  try {
    const fantasyTeam = await FantasyTeam.findById(teamId).populate("cyclists");
    if (!fantasyTeam) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: "No team with that ID" });
    }
    res.status(StatusCodes.OK).json(fantasyTeam);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

//@desc fetch all teams
//@route GET /api/fantasyteam
//@access Public

const getAllFantasyTeams = async (req, res) => {
  try {
    const teams = await FantasyTeam.find()
      .populate("cyclists")
      .populate({ path: "owner", select: "name" });
    if (!teams) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: "no teams available" });
    }
    res.status(StatusCodes.OK).json(teams);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};

//@desc create fantasy league teams
//@route PATCH /api/fantasyteam/:id/myleague
//@access private eventually
const createLeague = async (req, res) => {
  const { leagueName, teamIds } = req.body;
  const owner = req.user._id;

  // update the user's myLeaguefield
  await User.findByIdAndUpdate(owner, {
    myLeague: { name: leagueName, teamIds: teamIds },
  });

  res.status(StatusCodes.CREATED).json({ User });
};

//@desc get list of teams in users' league
//@route GET /api/fantasyteam/:id/myleague
//@access private eventually
const getLeague = async (req, res) => {
  const { userId } = req.params;
console.log(userId)
  try {
    const fantasyLeague = await User.findOne({_id: userId}).populate({
      path: "myLeague.teamIds",
      populate: {
        path: "owner",
        select: "name"
      }
    }
    );
    if (!fantasyLeague) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: "no league with that user" });
    }
  const {myLeague } = fantasyLeague
    res.status(StatusCodes.OK).json(myLeague);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};

export { createTeam, getSingleFantasyTeam, getAllFantasyTeams, createLeague, getSingleFantasyTeamById, getLeague };
