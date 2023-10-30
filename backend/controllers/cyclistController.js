//models
import Cyclist from "../models/Cyclist.js";
import Team from "../models/Team.js";
//libraries
import { StatusCodes } from "http-status-codes";

//@desc    get all riders, able to search through mainspecialty and name
//@route   GET /api/cyclists
//@access  public

const getAllRiders = async (req, res) => {
  const tab = req.query.tab
    ? { mainSpecialty: { $regex: req.query.tab, $options: "i" } }
    : {};
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};
  //search the db for cyclists that match the search objects
  try {
    const cyclists = await Cyclist.find({ ...tab, ...keyword });
    if (!cyclists) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "No cyclists found" });
    }
    return res.status(StatusCodes.OK).json(cyclists);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};

//@desc    get individual rider stats
//@route   GET /api/cyclists/:name
//@access  public

const getSingleRider = async (req, res) => {
  const { name } = req.params;

  try {
    const singleRider = await Cyclist.findOne({ name: name });
    if (!singleRider) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Cannot find cyclist with that name" });
    }
   return res.status(StatusCodes.OK).json(singleRider);
  } catch (error) {
   return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};
//@desc    get teams and their roster
//@route   GET /api/teams
//@access  public

const getAllTeams = async (req, res) => {
  //how many delivered per page
  const pageSize = 20;
  //get the page number from frontend, or set at 1
  const page = Number(req.query.pageNumber || 1);
  //get total docus in the collection
  const count = await Team.countDocuments({});
  //limit to 20, then skip to the page entered from frontend
  try {
    const teamRoster = await Team.find()
      .populate("cyclists")
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    if (!teamRoster) {
     return res.status(StatusCodes.NOT_FOUND).json({ msg: "No teams found" });
    }
   return res
      .status(StatusCodes.OK)
      .json({ teamRoster, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};
//@desc    get single team
//@route   GET /api/teams/:name
//@access  public

//by id (id is the teamname in this case)
const getSingleTeam = async (req, res) => {
  const { name } = req.params;

  try {
    const teamRoster = await Team.findOne({ _id: name }).populate("cyclists");
    if (!teamRoster) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "No team found with that name" });
    }
    res.status(StatusCodes.OK).json(teamRoster);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "internal server error" });
  }
};

export { getAllRiders, getSingleRider, getAllTeams, getSingleTeam };
