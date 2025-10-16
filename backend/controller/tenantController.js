
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
    const { plan } = req.body;
    const tenant = await Tenant.findById(req.user.tenant);

    if (!tenant)
      return res.status(404).json({ message: "Tenant not found" });

    tenant.plan = plan;
    await tenant.save();

    res.json({
      success: true,
      message: `Tenant upgraded to ${plan} plan`,
      tenant,
    });
  } catch (error) {
    next(error);
  }
};
