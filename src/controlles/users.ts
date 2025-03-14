import { Request, Response } from "express";
import { TeamMember } from "../models/teamMember.js";
import { v4 as uuidv4 } from "uuid";
import { readMembersDB, writeMembersDB } from "./dbUtils.js";

let teamMembers: TeamMember[] = [];

// Initialize team members from the database
(async () => {
  const initialData = await readMembersDB();
  teamMembers = initialData;
})();

// Add a new team member
export const addTeamMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, roles } = req.body;

  if (!name || !roles || roles.length < 1 || roles.length > 3) {
    res
      .status(400)
      .send("Each member must have a name and between 1 and 3 roles.");
    return;
  }

  const newMember: TeamMember = { id: uuidv4(), name, roles };
  teamMembers.push(newMember);

  await writeMembersDB(teamMembers);

  res.status(201).send(newMember);
};

// Get all team members
export const getTeamMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.send(teamMembers);
  return;
};
