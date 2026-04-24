import mongoose from "mongoose";
import { baseSchemaOptions } from "./schema-options.js";

const eventSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        name: { type: String, required: true },
        date: { type: Date, required: true },
        description: { type: String },
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    },
    baseSchemaOptions,
);

eventSchema.index({ adminId: 1, date: 1 });

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema, "Event");

export default Event;
