import mongoose  from "mongoose";
import bcrypt from "bcrypt";
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Member"], default: "Member" },
    tenant: { type: ObjectId, ref: "Tenant", required: true }
},{timestamps: true});


const User = mongoose.model("User", userSchema);

export default User;