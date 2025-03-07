import { Router } from "express";
import {
  addTeamMember,
  getTeamMembers,
} from "../controlles/users.js";

const router = Router();

router.post("/teamMember", addTeamMember);
router.get("/teamMember", getTeamMembers);

export default router;