
// src/controllers/tenantController.js
import Tenant from "../model/Tenant.js";

// Get current tenant info
export const getTenant = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.user.tenant);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    res.json({ success: true, tenant });
  } catch (error) {
    next(error);
  }
};

// Admin: upgrade tenant plan
export const upgradePlan = async (req, res, next) => {
  try {
    const tenant = await Tenant.findById(req.user.tenant);
    if (!tenant)
      return res.status(404).json({ message: "Tenant not found" });

    tenant.plan = "Pro";
    tenant.noteLimit = Infinity;
    await tenant.save();

    res.json({
      success: true,
      message: "Tenant upgraded to Pro plan",
      tenant,
    });
  } catch (error) {
    next(error);
  }
};

// Get all tenants (public - for registration)
export const getAllTenants = async (req, res, next) => {
  try {
    const tenants = await Tenant.find({}, "name slug _id");
    res.json({ success: true, tenants });
  } catch (error) {
    next(error);
  }
};