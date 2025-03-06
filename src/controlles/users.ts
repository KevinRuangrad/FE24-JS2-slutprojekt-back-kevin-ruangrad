import { Request, Response } from "express";
import { TeamMember } from "../models/teamMember.js";
import { Task } from "../models/taskmodel.js"; // Ensure this is imported
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";
import { format } from "date-fns";
import { writeTasksDB } from "./tasks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initialDataPath = path.join(__dirname, "../data/dbmembers.json");
console.log("BLAh", initialDataPath);

async function readDB() {
  const raw = await fs.readFile("./data/dbmembers.json", "utf-8");
  const db = JSON.parse(raw);
  return db;
}

async function writeDB(db) {
  const newDB = JSON.stringify(db, null, 2);
  await fs.writeFile("./data/dbmembers.json", newDB);
}


let teamMembers: TeamMember[] = [];
let tasks: Task[] = [];

(async () => {
  const initialData = await readDB();
  teamMembers = initialData.teamMembers;
  tasks = initialData.tasks;
})();

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

  const newMember: TeamMember = { id: uuidv4(), name, roles, tasks: [] };
  teamMembers.push(newMember);

  await writeDB({ teamMembers, tasks });

  res.status(201).send(newMember);
};

export const getTeamMembers = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.send(teamMembers);
  return;
};

export const addTaskToMember = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { memberId, title, description, category, assigned } = req.body;

  if (!title || !description || !category) {
    res.status(400).send("Task must have a title, description, and category.");
    return;
  }

  const teamMember = teamMembers.find((member) => member.id === memberId);
  if (!teamMember) {
    res.status(404).send({ message: "Team member not found" });
    return;
  }

  const newTask: Task = {
    id: uuidv4(),
    title,
    description,
    category,
    status: "to do",
    timestamp: format(new Date(), "yyyy-MM-dd HH:mm"),
    assigned: assigned || undefined,
  };

  teamMember.tasks.push(newTask);
  tasks.push(newTask);

  console.log("New task added:", newTask);
  console.log("Updated tasks array:", tasks);

  await writeTasksDB({ tasks, teamMembers });

  res.status(200).send(teamMember);
};

export const markTaskAsCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { memberId, taskId } = req.body;

  const member = teamMembers.find((member) => member.id === memberId);
  if (!member) {
    res.status(404).send({ message: "Team member not found" });
    return;
  }

  const task = member.tasks.find((task) => task.id === taskId);
  if (!task) {
    res.status(404).send({ message: "Task not found" });
    return;
  }

  task.status = "done";

  await writeTasksDB({ tasks, teamMembers });

  res.status(200).send({ message: "Task marked as completed", task });
};

export const deleteCompletedTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { memberId, taskId } = req.body;

  const teamMember = teamMembers.find((member) => member.id === memberId);
  if (!teamMember) {
    res.status(404).send({ message: "Team member not found" });
    return;
  }

  const taskIndex = teamMember.tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    res.status(404).send({ message: "Task not found" });
    return;
  }

  teamMember.tasks.splice(taskIndex, 1);
  tasks = tasks.filter((task) => task.id !== taskId);

  await writeTasksDB({ tasks, teamMembers });

  res.status(200).send({ message: "Task deleted successfully" });
};
