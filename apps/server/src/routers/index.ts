import { Router } from "express";
import menuItemRouter from "./menu-item.router";

const appRouter: Router = Router();

appRouter.use("/menu-items", menuItemRouter);

export { appRouter };
export type AppRouter = typeof appRouter;
