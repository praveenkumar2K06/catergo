import mongoose from "mongoose";
import { baseSchemaOptions } from "./schema-options.js";

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        icon: { type: String, default: "🍽️" },
        order: { type: Number, default: 0 },
        adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    },
    baseSchemaOptions,
);

categorySchema.index({ adminId: 1, name: 1 }, { unique: true });

const Category =
    mongoose.models.Category || mongoose.model("Category", categorySchema, "categories");

export default Category;
