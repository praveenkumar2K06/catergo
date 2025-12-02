import { Router } from "express";
import authRouter from "./auth.router";
import cartRouter from "./cart.router";
import categoryRouter from "./category.router";
import catererRouter from "./caterer.router";
import eventRouter from "./events.router";
import menuItemRouter from "./menu-item.router";
import settingsRouter from "./settings.router";
import userRouter from "./users.router";

const appRouter: Router = Router();

appRouter.use("/auth", authRouter);
appRouter.use("/caterer", catererRouter);
appRouter.use("/categories", categoryRouter);
appRouter.use("/menu-items", menuItemRouter);
appRouter.use("/users", userRouter);
appRouter.use("/events", eventRouter);
appRouter.use("/cart", cartRouter);
appRouter.use("/settings", settingsRouter);

export { appRouter };
export type AppRouter = typeof appRouter;
