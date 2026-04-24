import { Router } from "express";
import authRouter from "./auth.router.js";
import cartRouter from "./cart.router.js";
import categoryRouter from "./category.router.js";
import catererRouter from "./caterer.router.js";
import eventRouter from "./events.router.js";
import menuItemRouter from "./menu-item.router.js";
import settingsRouter from "./settings.router.js";
import userRouter from "./users.router.js";

const appRouter = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/caterer", catererRouter);
appRouter.use("/categories", categoryRouter);
appRouter.use("/menu-items", menuItemRouter);
appRouter.use("/users", userRouter);
appRouter.use("/events", eventRouter);
appRouter.use("/cart", cartRouter);
appRouter.use("/settings", settingsRouter);

export { appRouter };
