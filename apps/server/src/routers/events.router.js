import { Router } from "express";
import {
    createEvent,
    getEventById,
    getEvents,
    getTodaysEvents,
} from "../controllers/events.controller.js";
import { authenticateAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", createEvent);

router.use(authenticateAdmin);
router.get("/", getEvents);
router.get("/today", getTodaysEvents);
router.get("/:id", getEventById);

export default router;
