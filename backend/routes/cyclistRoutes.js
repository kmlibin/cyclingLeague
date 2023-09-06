import express from 'express'

import { getAllRiders } from '../controllers/controllerList.js'

const router = express.Router();

router.route("/").get(getAllRiders)

export default router