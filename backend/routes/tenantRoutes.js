

import express from "express";
import { getTenant, upgradePlan, getAllTenants } from "../controller/tenantController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public route — no auth needed
router.get("/all", getAllTenants);

router.use(protect);
router.get("/", getTenant);
router.put("/upgrade", adminOnly, upgradePlan);
router.post("/:slug/upgrade", adminOnly, upgradePlan);

export default router;