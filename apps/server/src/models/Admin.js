import mongoose from "mongoose";
import { baseSchemaOptions } from "./schema-options.js";

const adminSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        name: { type: String, required: true },
        role: { type: String, default: "admin" },
        isActive: { type: Boolean, default: true },
    },
    baseSchemaOptions,
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema, "admins");

export default Admin;
