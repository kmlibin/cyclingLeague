import Cyclist from "../models/Cyclist.js";
import Team from "../models/Team.js";
import { StatusCodes } from "http-status-codes";

//@desc    get all riders, enable searching through mainspecialty and name
//@route   GET /api/cyclists
//@access  public

const getAllRiders = async (req, res) => {
  const tab = req.query.tab
    ? { mainSpecialty: { $regex: req.query.tab, $options: "i" } }
    : {};
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};
  const cyclists = await Cyclist.find({ ...tab, ...keyword });
  res.status(StatusCodes.OK).json(cyclists);
};

//@desc    get individual rider stats
//@route   GET /api/cyclists/:name
//@access  public

const getSingleRider = async (req, res) => {
  const { name } = req.params;
  console.log(name);
  const singleRider = await Cyclist.findOne({ name: name });
  if (!singleRider) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "no cyclist with that name" });
  }
  res.status(StatusCodes.OK).json(singleRider);
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
  const teamRoster = await Team.find()
    .populate("cyclists")
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  if (!teamRoster) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "no teams found" });
  }
  res
    .status(StatusCodes.OK)
    .json({ teamRoster, page, pages: Math.ceil(count / pageSize) });
};

//@desc    get single team
//@route   GET /api/teams/:name
//@access  public

const getSingleTeam = async (req, res) => {
  const { name } = req.params;
  const teamRoster = await Team.findOne({ _id: name }).populate("cyclists");
  if (!teamRoster) {
    res.status(StatusCodes.NOT_FOUND).json({ msg: "no teams found" });
  }
  res.status(StatusCodes.OK).json(teamRoster);
};

//@desc    get individual race results
//@route   GET /api/races/:id
//@access  public

//@desc    add rider to team
//@route   POST /api/team
//@access  private

//@desc    delete rider from team
//@route   delete /api/team/:id
//@access  private

//@desc    confirm team selection
//@route   PATCH /api/confirmTeam
//@access  private

//@desc    add teams to league
//@route   PATCH /api/myLeague
//@access  private

export { getAllRiders, getSingleRider, getAllTeams, getSingleTeam };
