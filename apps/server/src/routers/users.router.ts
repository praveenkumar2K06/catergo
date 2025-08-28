import { Router } from "express";
import { createUser, updateUser } from "@/controllers/users.controller";

const router: Router = Router();

router.post("/", createUser);
router.put("/:id", updateUser);

export default router;
