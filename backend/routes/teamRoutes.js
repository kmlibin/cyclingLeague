import express from "express";

import {
  getTeams
} from "../controllers/controllerList.js";

const router = express.Router();

router.route("/").get(getTeams);

export default router;
