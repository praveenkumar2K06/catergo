import { Router } from "express";
import {
    createMenuItem,
    deleteMenuItem,
    getAllMenuItems,
    updateMenuItem,
} from "../controllers/menu-item.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:id", getAllMenuItems);

router.use(authenticateAdmin);
router.post("/", createMenuItem);
router.put("/:id", updateMenuItem);
router.delete("/:id", deleteMenuItem);

export default router;
