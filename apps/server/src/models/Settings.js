import mongoose from "mongoose";
import { baseSchemaOptions } from "./schema-options.js";

const settingsSchema = new mongoose.Schema(
    {
        maxOrdersPerDay: { type: Number, default: 50 },
        enableDailyOrderLimit: { type: Boolean, default: true },
        bulkOrderDiscount: { type: Number, default: 10 },
        bulkOrderMinPersons: { type: Number, default: 5 },
        hidePrices: { type: Boolean, default: false },
        blockedDates: { type: [Date], default: [] },
        tax: { type: Number, default: 0 },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
            unique: true,
        },
    },
    baseSchemaOptions,
);

const Settings =
    mongoose.models.Settings || mongoose.model("Settings", settingsSchema, "settings");

export default Settings;
