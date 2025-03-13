import * as fs from "fs/promises";
import * as path from "path";
import { Task } from "../models/taskmodel.js";
import { TeamMember } from "../models/teamMember.js";

const tasksDataPath = "./dbtask.json";
const membersDataPath = "./dbmembers.json";

export async function readTasksDB(): Promise<Task[]> {
  const raw = await fs.readFile(tasksDataPath, "utf-8");
  const tasks = JSON.parse(raw);
  return Array.isArray(tasks) ? tasks : [];
}

export async function writeTasksDB(tasks: Task[]): Promise<void> {
  const newDB = JSON.stringify(tasks, null, 2);
  await fs.writeFile(tasksDataPath, newDB);
}

export async function readMembersDB(): Promise<TeamMember[]> {
  const raw = await fs.readFile(membersDataPath, "utf-8");
  const members = JSON.parse(raw);
  return Array.isArray(members) ? members : [];
}

export async function writeMembersDB(members: TeamMember[]): Promise<void> {
  const newDB = JSON.stringify(members, null, 2);
  await fs.writeFile(membersDataPath, newDB);
}
