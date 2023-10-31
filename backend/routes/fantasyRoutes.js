import express from "express";

//controllers
import {
  createTeam,
  getSingleFantasyTeam,
  getAllFantasyTeams,
  createLeague,
  getSingleFantasyTeamById,
  getLeague,
} from "../controllers/fantasyController.js";

//middleware
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createTeam).get(getAllFantasyTeams);
router.route("/teams/:teamId").get(protect, getSingleFantasyTeamById);
router.route("/:userId").get(protect, getSingleFantasyTeam);
router.route("/:userId/myleague").patch(protect, createLeague).get(protect, getLeague);

export default router;

