
// src/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import Tenant from "../model/Tenant.js";

// Helper to sign JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, tenant: user.tenant, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};


export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, tenantId } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    let tenant;

    if (role === "Admin") {
      // Admin creates a new company/tenant
      if (!companyName)
        return res.status(400).json({ message: "Company name is required" });

      // Check if company name already exists
      const existingTenant = await Tenant.findOne({ name: companyName });
      if (existingTenant)
        return res.status(400).json({ message: "Company name already exists" });

      // Auto generate slug
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const slug = `${companyName.toLowerCase().replace(/\s+/g, "-")}-${randomSuffix}`;

      tenant = await Tenant.create({
        name: companyName,
        slug,
        plan: "Free",
        noteLimit: 3,
      });

    } else {
      // Member joins existing tenant
      if (!tenantId)
        return res.status(400).json({ message: "Please select a company" });

      tenant = await Tenant.findById(tenantId);
      if (!tenant)
        return res.status(404).json({ message: "Company not found" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "Member",
      tenant: tenant._id,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: user.tenant,
      },
    });
  } catch (error) {
    next(error);
  }
};


// Login existing user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: user.tenant,
      },
    });
  } catch (error) {
    next(error);
  }
};
