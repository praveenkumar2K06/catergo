import mongoose from "mongoose";
import { baseSchemaOptions } from "./schema-options.js";

const cartItemSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
        quantity: { type: Number, default: 1 },
    },
    baseSchemaOptions,
);

cartItemSchema.index({ userId: 1, menuItemId: 1 });

const CartItem =
    mongoose.models.CartItem || mongoose.model("CartItem", cartItemSchema, "CartItem");

export default CartItem;
