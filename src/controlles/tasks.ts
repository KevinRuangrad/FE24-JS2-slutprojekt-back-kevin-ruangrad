import { Request, Response } from "express";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { TeamMember } from "../models/teamMember.js";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

type Category = "UX" | "dev frontend" | "dev backend";
type Status = "to do" | "in progress" | "done";

type Task = {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  timestamp: string;
  assigned?: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initialDataPath = path.join(__dirname, "../data/dbtask.json");
console.log("HÄÄÄR", initialDataPath)

async function readTasksDB() {
  const raw = await fs.readFile("./data/dbtask.json", "utf-8");
  const db = JSON.parse(raw);
  return db;
}

export async function writeTasksDB(db) {
  const newDB = JSON.stringify(db, null, 2);
  await fs.writeFile("./data/dbtask.json", newDB);
}

let tasks: Task[] = [];
let teamMembers: TeamMember[] = [];

(async () => {
  const initialData = await readTasksDB();
  tasks = initialData.tasks;
  teamMembers = initialData.teamMembers;
})();

export const addTask = async (req: Request, res: Response): Promise<void> => {
  const { title, description, category, status, assigned } = req.body;

  if (!title || !description || !category) {
    res.status(400).send("Task must have a title, description and category.");
    return;
  }

  const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm");
  const newTask: Task = {
    id: uuidv4(),
    title,
    description,
    category,
    status: "to do",
    timestamp: formattedDate,
    assigned: assigned || undefined,
  };
  tasks.push(newTask);

  await writeTasksDB({ tasks });

  res.status(201).send(newTask);
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, assigned } = req.body;

  const task = tasks.find((task) => task.id === id);
  if (!task) {
    res.status(404).send({ message: "Task not found" });
    return;
  }

  if (status) {
    task.status = status;
  }

  if (assigned) {
    task.assigned = assigned;
  }

  await writeTasksDB({ tasks });

  res.status(200).send(task);
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  res.send(tasks);
  return;
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    res.status(404).send({ message: "Task not found" });
    return;
  }

  tasks.splice(taskIndex, 1);

  await writeTasksDB({ tasks });

  res.status(200).send({ message: "Task deleted successfully" });
};