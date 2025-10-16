
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import connectDB from "../configs/db.js";
import User from "../model/User.js";
import Tenant from "../model/Tenant.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // --- Define tenants ---
    const tenants = [
      { name: "Acme", slug: "acme", plan: "Free" },
      { name: "Globex", slug: "globex", plan: "Free" }
    ];

    // --- Create tenants if not exist ---
    const tenantDocs = {};
    for (const t of tenants) {
      let tenant = await Tenant.findOne({ name: t.name });
      if (!tenant) {
        tenant = await Tenant.create(t);
      }
      tenantDocs[t.name] = tenant._id;
    }

    // --- Define users ---
    const users = [
      { name: "Acme Admin", email: "admin@acme.test", role: "Admin", tenant: tenantDocs["Acme"] },
      { name: "Acme User", email: "user@acme.test", role: "Member", tenant: tenantDocs["Acme"] },
      { name: "Globex Admin", email: "admin@globex.test", role: "Admin", tenant: tenantDocs["Globex"] },
      { name: "Globex User", email: "user@globex.test", role: "Member", tenant: tenantDocs["Globex"] },
    ];

    const hashedPassword = await bcrypt.hash("password", 10);

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        await User.create({ ...u, password: hashedPassword });
        console.log(`✅ Created user: ${u.email}`);
      } else {
        console.log(`ℹ️ User already exists: ${u.email}`);
      }
    }

    console.log("✅ Seeding complete!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    process.exit(1);
  }
};

seedData();
