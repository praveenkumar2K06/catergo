import { Router } from "express";
import {
	getAllCaterers,
	verifyCaterer,
} from "@/controllers/caterer.controller";

const router: Router = Router();

router.post("/verify", verifyCaterer);
router.get("/all", getAllCaterers);

export default router;
