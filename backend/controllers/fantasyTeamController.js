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

//@desc fetch all leagues
//@route GET /api/fantasyteam
//@access Public

const getSingleFantasyTeam = async (req, res) => {
  const { _id: teamId } = req.body;
  console.log(teamId);
  const fantasyTeam = await FantasyTeam.findById(teamId).populate("cyclists");
  if (!fantasyTeam) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "no cyclist with that name" });
  }
  res.status(StatusCodes.OK).json(fantasyTeam);
};
// const getAllLeagues = async(req,res) => {
//     try {
//         const leagues = await League.find().populate('cyclists')
//         res.json(leagues)
//     }catch(error) {
//         console.log('error');
//         res.status(500).json({msg: 'internal server error'})
//     }
// }

export { createTeam, getSingleFantasyTeam };
