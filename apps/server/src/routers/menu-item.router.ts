import { Router } from "express";
import {
	createMenuItem,
	deleteMenuItem,
	getAllMenuItems,
	updateMenuItem,
} from "@/controllers/menu-item.controller";

const router: Router = Router();

router.get("/", getAllMenuItems);
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
