import express from "express";

import {
  createTeam
} from "../controllers/fantasyTeamController.js";

import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();

router.route("/").post(protect, createTeam);


export default router;
