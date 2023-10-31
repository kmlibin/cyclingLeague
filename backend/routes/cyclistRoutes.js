import express from "express";
//controllers
import {
  getAllRiders,
  getSingleRider,
} from "../controllers/cyclistController.js";

const router = express.Router();

router.route("/").get( getAllRiders);
router.route("/:name").get(getSingleRider);

export default router;
