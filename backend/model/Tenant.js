
import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: {type: String, required: true, unique: true, lowercase: true},
    plan: { type: String, enum: ["Free", "Pro"], default: "Free" },
    noteLimit: { type: Number, default: 3 },            // Only applies for Free plan
},{timestamps: true});

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;