import mongoose from "mongoose";
import { baseSchemaOptions } from "./schema-options.js";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        pincode: { type: String, required: true },
        numberOfPeople: { type: Number, required: true },
        selectedDate: { type: Date, required: true },
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    },
    baseSchemaOptions,
);

userSchema.index({ adminId: 1, selectedDate: -1 });

const User = mongoose.models.User || mongoose.model("User", userSchema, "User");

export default User;
