import FantasyTeam from "../models/FantasyTeam.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";

//@desc create league
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

//@desc fetch single leagues
//@route GET /api/fantasyteam
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

//@desc fetch all leagues
//@route GET /api/fantasyteam
//@access Public

const getAllFantasyTeams = async (req, res) => {
  try {
    const teams = await FantasyTeam.find().populate("cyclists");
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

export { createTeam, getSingleFantasyTeam, getAllFantasyTeams };
