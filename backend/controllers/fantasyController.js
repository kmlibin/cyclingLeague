//models
import FantasyTeam from "../models/FantasyTeam.js";
import User from "../models/User.js";

//libraries
import { StatusCodes } from "http-status-codes";

//utils
import { calculateTotalPoints } from "../utils/index.js";

//@desc create team
//@route POST /api/fantasyteam
//@access private
const createTeam = async (req, res) => {
  const { cyclistIds, teamName } = req.body;
  const owner = req.user._id;

  //check that there are 25 cyclists
  if (cyclistIds.length != 25) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Team must contain 25 cyclists" });
  }
  //make sure there is a team name
  if (!teamName || teamName.trim() === "") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Team name cannot be empty" });
  }

  try {
    //sums points of all riders
    const totalPoints = await calculateTotalPoints(cyclistIds);
    //check if user already has a team, if so, delete. also delete associated league
    const existingTeam = await FantasyTeam.findOne({ owner });
    if (existingTeam) {
      await FantasyTeam.deleteMany({ owner });
      await User.findByIdAndUpdate(owner, { $unset: { myLeague: "" } });
    }
    //create the fantasy team
    const team = new FantasyTeam({
      owner,
      cyclists: cyclistIds,
      teamName,
      totalPoints,
    });

    const createdTeam = await team.save();

    // update the user's myTeam field
    await User.findByIdAndUpdate(owner, { myTeam: createdTeam._id });
    return res.status(StatusCodes.CREATED).json({ createdTeam });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

//@desc fetch single teams by userId
//@route GET /api/fantasyteam/:userId
//@access private

const getSingleFantasyTeam = async (req, res) => {
  const { userId } = req.params;

  try {
    const fantasyTeam = await FantasyTeam.findOne({ owner: userId }).populate(
      "cyclists"
    );
    if (!fantasyTeam) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No team with that name" });
    }
    return res.status(StatusCodes.OK).json(fantasyTeam);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

//@desc fetch single teams BY THEIR IDS
//@route GET /api/fantasyteam/teams/:teamId
//@access private

const getSingleFantasyTeamById = async (req, res) => {
  const { teamId } = req.params;
  try {
    const fantasyTeam = await FantasyTeam.findById(teamId).populate("cyclists");
    if (!fantasyTeam) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No team with that ID" });
    }
    return res.status(StatusCodes.OK).json(fantasyTeam);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

//@desc fetch all fantasy teams
//@route GET /api/fantasyteam
//@access private

const getAllFantasyTeams = async (req, res) => {
  try {
    const teams = await FantasyTeam.find()
      .populate("cyclists")
      .populate({ path: "owner", select: "name" });
    if (!teams) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No teams available" });
    }
    return res.status(StatusCodes.OK).json(teams);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

//@desc create fantasy league teams
//@route PATCH /api/fantasyteam/:id/myleague
//@access private
const createLeague = async (req, res) => {
  const { leagueName, teamIds } = req.body;
  const owner = req.user._id;

  //check that there are 25 cyclists
  if (teamIds.length <= 1 || teamIds.length > 10) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "League must have more than one but fewer than 10 teams" });
  }
  //make sure there is a team name
  if (!leagueName || leagueName.trim() === "") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "League name cannot be empty" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(owner, {
      myLeague: { name: leagueName, teamIds: teamIds },
    });

    if (!updatedUser) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "No user found" });
    }
    return res.status(StatusCodes.CREATED).json({ msg: "Created" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

//@desc get list of teams in users' league
//@route GET /api/fantasyteam/:id/myleague
//@access private
const getLeague = async (req, res) => {
  const { userId } = req.params;
  try {
    const fantasyLeague = await User.findOne({ _id: userId }).populate({
      path: "myLeague.teamIds",
      populate: {
        path: "owner",
        select: "name",
      },
    });
  
    if (!fantasyLeague) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No league associated with that user" });
    }
   
    const { myLeague } = fantasyLeague;
    return res.status(StatusCodes.OK).json(myLeague);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

export {
  createTeam,
  getSingleFantasyTeam,
  getAllFantasyTeams,
  createLeague,
  getSingleFantasyTeamById,
  getLeague,
};
