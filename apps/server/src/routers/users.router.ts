import { Router } from "express";
import {
	createUser,
	getUsers,
	getUsersV2,
	updateUser,
} from "@/controllers/users.controller";

const router: Router = Router();

router.get("/v2", getUsersV2);
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);

export default router;
