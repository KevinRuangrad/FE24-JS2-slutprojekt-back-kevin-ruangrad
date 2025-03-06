import { Router } from "express";
import {
  addTeamMember,
  getTeamMembers,
  addTaskToMember,
  markTaskAsCompleted,
  deleteCompletedTask,
} from "../controlles/users.js";

const router = Router();

router.post("/teamMember", addTeamMember);
router.patch("/teamMember/task", addTaskToMember); 
router.get("/teamMember", getTeamMembers);
router.patch("/teamMember/task/completed", markTaskAsCompleted); 
router.delete("/teamMember/task", deleteCompletedTask); 

export default router;
