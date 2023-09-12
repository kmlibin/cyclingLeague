import express from "express";

import {
  registerUser,
  authUser,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();

router.route("/").post(registerUser);
router.route("/logout").post(logoutUser);
router.route("/auth").post(authUser);

export default router