

import express from "express";
import {
  getTenant,
  upgradePlan,
} from "../controller/tenantController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getTenant);
router.put("/upgrade", adminOnly, upgradePlan);

export default router;
