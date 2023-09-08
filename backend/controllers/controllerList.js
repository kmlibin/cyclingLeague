import Cyclist from "../models/Cyclist.js";
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
  const {name} = req.params;
  console.log(name)
  const singleRider = await Cyclist.find({name: name})
  if(!singleRider) {
    res.status(StatusCodes.NOT_FOUND).json({msg: 'no cyclist with that name'})
  }
  res.status(StatusCodes.OK).json({singleRider})
};
//@desc    get individual rider stats
//@route   GET /api/riders/:id
//@access  public

//@desc    get all races
//@route   GET /api/races
//@access  public

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

export { getAllRiders, getSingleRider };
