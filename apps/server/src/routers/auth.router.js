import { Router } from "express";
import {
    changePassword,
    createAdmin,
    loginAdmin,
    verifyToken,
} from "../controllers/auth.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", loginAdmin);
router.post("/create", createAdmin);

router.use(authenticateAdmin);
router.get("/verify", verifyToken);
router.post("/change-password", changePassword);

export default router;
