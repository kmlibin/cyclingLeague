import Cyclist from "../models/Cyclist.js";
import { StatusCodes } from "http-status-codes";

//@desc    get all riders
//@route   GET /api/cyclists
//@access  public

const getAllRiders = async (req, res) => {
const tab = req.query.tab ? { mainSpecialty: { $regex: req.query.tab, $options: "i" } }
: {};
console.log(tab)
  const cyclists = await Cyclist.find({...tab});
  res.status(StatusCodes.OK).json(cyclists);
};

//@desc    get individual rider stats
//@route   GET /api/cyclists/:category
//@access  public

const getRidersByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const cyclists = await Cyclist.find({ mainSpecialty: category });
    if (!cyclists || cyclists.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "no riders found with that category" });
    }
    res.status(StatusCodes.OK).json({ cyclists });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
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

export { getAllRiders, getRidersByCategory };
