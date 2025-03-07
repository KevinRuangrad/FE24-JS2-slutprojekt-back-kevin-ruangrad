import { Router } from "express";
import {
  addTask,
  getTasks,
  addTaskToMember,
  markTaskAsCompleted,
  deleteCompletedTask,
} from "../controlles/tasks.js";

const router = Router();

router.post("/task", addTask);
router.get("/task", getTasks);
router.patch("/task/:taskId/assign", addTaskToMember);
router.patch("/task/:taskId/done", markTaskAsCompleted);
router.delete("/task/:taskId", deleteCompletedTask);

export default router;
