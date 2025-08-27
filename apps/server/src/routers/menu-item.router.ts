import { Router } from "express";
import { getAllMenuItems } from "@/controllers/menu-item.controller";

const router: Router = Router();

router.get("/", getAllMenuItems);

export default router;
