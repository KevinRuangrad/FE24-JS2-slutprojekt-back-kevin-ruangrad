import { Router } from "express";
import { addTeamMember, getTeamMembers } from "../controlles/users.js";

const router = Router();

router.post("/member", addTeamMember);
router.get("/member", getTeamMembers);

export default router;
