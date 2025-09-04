import { Router } from "express";
import {
	createUser,
	getUsers,
	updateUser,
} from "@/controllers/users.controller";

const router: Router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);

export default router;
