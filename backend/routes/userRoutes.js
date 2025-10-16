
// src/routes/userRoutes.js
import express from "express";
import {
  getUsersByTenant,
  inviteUser,
  deleteUser,
} from "../controller/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();    

router.use(protect, adminOnly); // all routes require admin

router.get("/", getUsersByTenant);
router.post("/invite", inviteUser);
router.delete("/delete/:id", deleteUser);

export default router;
