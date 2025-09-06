import { Router } from "express";
import { createEvent, getEvents } from "@/controllers/events.controller";

const router: Router = Router();

router.get("/", getEvents);
router.post("/", createEvent);

export default router;
