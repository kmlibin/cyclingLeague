import express from "express";

import {
  createTeam
} from "../controllers/userTeamController.js";

const router = express.Router();

router.route("/").post(createTeam);


export default router;
