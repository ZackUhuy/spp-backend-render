import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { roleMiddleware } from "../middlewares/roleMiddleware.js";
import { ActivityLogController } from "../controllers/ActivityLogController.js";

const router = Router();
const controller = new ActivityLogController();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  controller.getAll.bind(controller)
);

export default router;
