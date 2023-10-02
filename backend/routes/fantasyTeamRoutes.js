import express from "express";

import {
  createTeam,
  getSingleFantasyTeam,
  getAllFantasyTeams,
  createLeague,
  getSingleFantasyTeamById,
  getLeague,
} from "../controllers/fantasyTeamController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createTeam).get(getAllFantasyTeams);
router.route("/teams/:teamId").get(getSingleFantasyTeamById);
router.route("/:userId").get(protect, getSingleFantasyTeam);
router.route("/:userId/myleague").patch(protect, createLeague).get(getLeague);

export default router;

//@route PATCH /api/fantasyteam/:id/myleague
