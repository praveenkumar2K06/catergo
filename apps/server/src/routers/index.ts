import { Router } from "express";
import cartRouter from "./cart.router";
import eventRouter from "./events.router";
import menuItemRouter from "./menu-item.router";
import userRouter from "./users.router";

const appRouter: Router = Router();

appRouter.use("/menu-items", menuItemRouter);
appRouter.use("/users", userRouter);
appRouter.use("/events", eventRouter);
appRouter.use("/cart", cartRouter);

export { appRouter };
export type AppRouter = typeof appRouter;
