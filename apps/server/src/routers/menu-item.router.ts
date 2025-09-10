import { Router } from "express";
import {
	createMenuItem,
	deleteMenuItem,
	getAllMenuItems,
	updateMenuItem,
} from "@/controllers/menu-item.controller";
import { authenticateAdmin } from "@/middleware/auth.middleware";

const router: Router = Router();

router.get("/:id", getAllMenuItems);

router.use(authenticateAdmin);
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
