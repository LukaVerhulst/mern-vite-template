import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import connectDB from "./config/db.js";

dotenv.config();

const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@example.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "supersecret";

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: ADMIN_EMAIL });
    if (adminExists) {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
      process.exit();
    }

    // Do NOT hash here — the User pre('save') hook will hash the password
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });

    console.log("Admin created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

seedAdmin();