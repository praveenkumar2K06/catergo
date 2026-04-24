import { Router } from "express";
import {
    createCategory,
    deleteCategory,
    getAllCategories,
    updateCategory,
} from "../controllers/category.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:id", getAllCategories);

router.use(authenticateAdmin);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
