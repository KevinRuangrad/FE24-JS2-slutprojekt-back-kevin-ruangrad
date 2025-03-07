import * as fs from "fs/promises";
import * as path from "path";
import { Task } from "../models/taskmodel.js";
import { TeamMember } from "../models/teamMember.js";

const tasksDataPath = "./dbtask.json";
const membersDataPath = "./dbmembers.json";

export async function readTasksDB() {
  const raw = await fs.readFile(tasksDataPath, "utf-8");
  const db = JSON.parse(raw);
  return db;
}

export async function writeTasksDB(db: { tasks: Task[] }) {
  const newDB = JSON.stringify(db, null, 2);
  await fs.writeFile(tasksDataPath, newDB);
}

export async function readMembersDB() {
  const raw = await fs.readFile(membersDataPath, "utf-8");
  const db = JSON.parse(raw);
  return db;
}

export async function writeMembersDB(db: { teamMembers: TeamMember[] }) {
  const newDB = JSON.stringify(db, null, 2);
  await fs.writeFile(membersDataPath, newDB);
}