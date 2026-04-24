import { Router } from "express";
import {
    createCartItem,
    deleteCartItem,
    updateCartQuantity,
} from "../controllers/cart.controller.js";

const router = Router();

router.post("/", createCartItem);
router.patch("/", updateCartQuantity);
router.delete("/:id", deleteCartItem);

export default router;
