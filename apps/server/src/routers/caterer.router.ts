import { Router } from "express";
import { verifyCaterer } from "@/controllers/caterer.controller";

const router: Router = Router();

router.post("/verify", verifyCaterer);

export default router;
