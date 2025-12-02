import { Router } from "express";
import {
	createCategory,
	deleteCategory,
	getAllCategories,
	reorderCategories,
	updateCategory,
} from "@/controllers/category.controller";
import { authenticateAdmin } from "@/middleware/auth.middleware";

const router: Router = Router();

// Public route - get categories by admin id
router.get("/:id", getAllCategories);

// Protected routes - require admin authentication
router.use(authenticateAdmin);
router.post("/", createCategory);
router.put("/reorder", reorderCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
