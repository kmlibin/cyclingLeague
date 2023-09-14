import express from "express";

import {
  createTeam, getSingleFantasyTeam
} from "../controllers/fantasyTeamController.js";

import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.route("/").post(protect, createTeam).get(protect, getSingleFantasyTeam);


export default router;
