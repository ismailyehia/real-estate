import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth.js";
import propertiesRouter from "./properties.js";
import favoritesRouter from "./favorites.js";
import messagesRouter from "./messages.js";
import reviewsRouter from "./reviews.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/properties", propertiesRouter);
router.use("/favorites", favoritesRouter);
router.use("/messages", messagesRouter);
router.use("/reviews", reviewsRouter);
router.use("/admin", adminRouter);

export default router;
