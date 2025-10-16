
import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types;

const noteSchema = new mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String},
    createdBy: {type: ObjectId, ref:"User", required: true},
    tenant: {type: ObjectId, ref:"Tenant", required: true}
},{timestamps: true});

const Notes = mongoose.model("Notes", noteSchema);

export default Notes;