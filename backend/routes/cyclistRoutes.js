import express from "express";

import {
  getAllRiders,
  getRidersByCategory,
} from "../controllers/controllerList.js";

const router = express.Router();

router.route("/").get(getAllRiders);
router.route("/:category").get(getRidersByCategory);

export default router;
