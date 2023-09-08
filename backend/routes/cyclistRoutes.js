import express from "express";

import {
  getAllRiders,
  getSingleRider,
} from "../controllers/controllerList.js";

const router = express.Router();

router.route("/").get(getAllRiders);
router.route("/:name").get(getSingleRider);

export default router;
