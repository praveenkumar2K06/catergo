import mongoose from "mongoose";
import { baseSchemaOptions } from "./schema-options.js";

const menuItemSchema = new mongoose.Schema(
    {
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        isVeg: { type: Boolean, required: true },
        qtyPerUnit: { type: Number, default: 1 },
        metrics: { type: String, enum: ["Piece", "Kg", "Litre"], default: "Piece" },
        order: { type: Number, default: 0 },
    },
    baseSchemaOptions,
);

menuItemSchema.index({ adminId: 1, category: 1 });
menuItemSchema.index({ adminId: 1, createdAt: -1 });

const MenuItem =
    mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema, "MenuItem");

export default MenuItem;
