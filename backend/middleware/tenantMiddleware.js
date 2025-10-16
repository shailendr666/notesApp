

export const verifyTenantAccess = (req, res, next) => {
  const tenantId = req.user?.tenant?.toString();
  const resourceTenantId = req.params.tenantId || req.body.tenant;

  if (tenantId && resourceTenantId && tenantId !== resourceTenantId) {
    return res.status(403).json({ message: "Access denied to another tenant's data" });
  }

  next();
};
