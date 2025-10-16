
import bcrypt from "bcrypt";
import User from "../model/User.js";

// GET: List all users for the current tenant
export const getUsersByTenant = async (req, res, next) => {
  try {
    const tenantId = req.user.tenant;
    const users = await User.find({ tenant: tenantId }).select("-password");
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// POST: Invite (create) a new user for the current tenant
export const inviteUser = async (req, res, next) => {
  try {
    const tenantId = req.user.tenant;
    const { name, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user tied to the same tenant
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      tenant: tenantId,
    });

    res.status(201).json({
      success: true,
      message: "User invited successfully",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        tenant: newUser.tenant,
      },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: Remove a user (Admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const tenantId = req.user.tenant;
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    // Prevent deleting users from another tenant
    if (user.tenant.toString() !== tenantId.toString())
      return res
        .status(403)
        .json({ message: "Cannot delete user from another tenant" });

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
