import { Router } from "express";
import {
	addBlockedDate,
	getBlockedDates,
	getSettings,
	removeBlockedDate,
	updateSettings,
} from "@/controllers/settings.controller";

const router: Router = Router();

router.get("/", getSettings);
router.put("/", updateSettings);
router.get("/blocked-dates", getBlockedDates);
router.post("/blocked-dates", addBlockedDate);
router.delete("/blocked-dates", removeBlockedDate);

export default router;
