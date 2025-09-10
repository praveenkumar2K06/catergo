import { Router } from "express";
import {
	createUser,
	getUsersV2,
	updateUser,
} from "@/controllers/users.controller";
import { authenticateAdmin } from "@/middleware/auth.middleware";

const router: Router = Router();

router.post("/", createUser);
router.put("/:id", updateUser);

router.use(authenticateAdmin);
router.get("/v2", getUsersV2);

export default router;
