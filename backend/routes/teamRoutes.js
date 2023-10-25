import express from "express";

import {
  getAllTeams, getSingleTeam
} from "../controllers/cyclistController.js";

const router = express.Router();

router.route("/").get(getAllTeams);
router.route("/:name").get(getSingleTeam)

export default router;
