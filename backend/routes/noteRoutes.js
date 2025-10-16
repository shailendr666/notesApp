
// src/routes/noteRoutes.js
import express from "express";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from "../controller/noteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // all note routes require authentication

router.get("/fetchNote", getNotes);
router.get("/fetchNoteById/:id", getNoteById);
router.post("/createNote", createNote);
router.put("/updateNote/:id", updateNote);
router.delete("/deleteNote/:id", deleteNote);

export default router;
