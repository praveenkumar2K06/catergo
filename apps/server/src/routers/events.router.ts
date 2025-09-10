import { Router } from "express";
import {
	createEvent,
	getEventById,
	getEvents,
} from "@/controllers/events.controller";
import { authenticateAdmin } from "@/middleware/auth.middleware";

const router: Router = Router();

router.post("/", createEvent);

router.use(authenticateAdmin);
router.get("/", getEvents);
router.get("/:id", getEventById);

export default router;
