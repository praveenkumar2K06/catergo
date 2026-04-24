import { Router } from "express";
import {
    addBlockedDate,
    getBlockedDates,
    getSettings,
    removeBlockedDate,
    updateSettings,
} from "../controllers/settings.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/blocked-dates", getBlockedDates);
router.get("/", getSettings);

router.use(authenticateAdmin);
router.put("/", updateSettings);
router.post("/blocked-dates", addBlockedDate);
router.delete("/blocked-dates", removeBlockedDate);

export default router;
