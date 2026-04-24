import { Router } from "express";
import {
    createUser,
    deleteUser,
    getUsersV2,
    updateUser,
} from "../controllers/users.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

router.use(authenticateAdmin);
router.get("/v2", getUsersV2);

export default router;
