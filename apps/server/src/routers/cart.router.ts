import { Router } from "express";
import {
	createCartItem,
	deleteCartItem,
	updateCartQuantity,
} from "@/controllers/cart.controller";

const router: Router = Router();

router.post("/", createCartItem);
router.patch("/", updateCartQuantity);
router.delete("/:id", deleteCartItem);

export default router;
