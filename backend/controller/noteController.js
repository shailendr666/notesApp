
// src/controllers/noteController.js
import Notes from "../model/Notes.js";
import Tenant from "../model/Tenant.js";

// Get all notes for a tenant
export const getNotes = async (req, res, next) => {
  try {
    const tenantId = req.user.tenant;
    const notes = await Notes.find({ tenant: tenantId });
    res.json({ success: true, notes });
  } catch (error) {
    next(error);
  }
};

// Get note by ID
export const getNoteById = async (req, res, next) => {
  try {
    const note = await Notes.findById(req.params.id);

    if (!note)
      return res.status(404).json({ message: "Note not found" });

    // tenant isolation check
    if (note.tenant.toString() !== req.user.tenant.toString())
      return res
        .status(403)
        .json({ message: "Access denied to another tenant's data" });

    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// Create a new note
export const createNote = async (req, res, next) => {
  try {
    const tenantId = req.user.tenant;
    const { title, content } = req.body;

    // Check note limit for Free plan
    const tenant = await Tenant.findById(tenantId);
    if (tenant.plan === "Free") {
      const noteCount = await Notes.countDocuments({ tenant: tenantId });
      if (noteCount >= tenant.noteLimit) {
        return res.status(403).json({
          message: "Note limit reached. Upgrade to Pro for unlimited notes.",
          limitReached: true
        });
      }
    }

    const note = await Notes.create({
      title,
      content,
      tenant: tenantId,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};


// Update note
export const updateNote = async (req, res, next) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.tenant.toString() !== req.user.tenant.toString())
      return res
        .status(403)
        .json({ message: "Access denied to another tenant's data" });

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    await note.save();

    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// Delete note
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.tenant.toString() !== req.user.tenant.toString())
      return res
        .status(403)
        .json({ message: "Access denied to another tenant's data" });

    await note.deleteOne();
    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    next(error);
  }
};
