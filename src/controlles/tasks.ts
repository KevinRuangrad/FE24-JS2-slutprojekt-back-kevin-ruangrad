import { Request, Response } from "express";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { TeamMember } from "../models/teamMember.js";
import { Task } from "../models/taskmodel.js";
import { readTasksDB, writeTasksDB, readMembersDB } from "./dbUtils.js";

export type Category = "UX" | "dev frontend" | "dev backend";
export type Status = "to do" | "in progress" | "done";

let tasks: Task[] = [];
let teamMembers: TeamMember[] = [];

(async () => {
  const initialTasksData = await readTasksDB();
  tasks = initialTasksData;
  const initialMembersData = await readMembersDB();
  teamMembers = initialMembersData;
  console.log(tasks);
})();

export const addTask = async (req: Request, res: Response): Promise<void> => {
  const { title, description, category, status } = req.body;

  if (!title || !description || !category) {
    res.status(400).send("Task must have a title, description and category.");
    return;
  }

  const formattedDate = format(new Date(), "yyyy-MM-dd HH:mm");
  const newTask: Task = {
    id: uuidv4(),
    title,
    description,
    category: category as Category,
    status: status as Status,
    timestamp: formattedDate,
  };
  tasks.push(newTask);

  await writeTasksDB(tasks);

  res.status(201).send(newTask);
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { status, assigned } = req.body;

  const task = tasks.find((task) => task.id === id);
  if (!task) {
    res.status(404).send({ message: "Task not found" });
    return;
  }

  if (status) {
    task.status = status as Status;
  }

  if (assigned) {
    task.assigned = assigned;
  }

  await writeTasksDB(tasks);

  res.status(200).send(task);
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  res.send(tasks);
  return;
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    res.status(404).send({ message: "Task not found" });
    return;
  }

  tasks.splice(taskIndex, 1);

  await writeTasksDB(tasks);

  res.status(200).send({ message: "Task deleted successfully" });
};

export const addTaskToMember = async (
  req: Request,
  res: Response
): Promise<Task | any> => {
  const { memberId } = req.body;
  const { taskId } = req.params;
  const tasks = await readTasksDB();
  const task = tasks.find((task) => task.id === taskId);
  const members = await readMembersDB();
  const member = members.find((member) => member.id === memberId);

  if (
    task &&
    member &&
    member.roles.includes(
      (task.category as "ux") || "dev backend" || "dev frontend"
    )
  ) {
    task.assigned = memberId;
    task.status = "in progress";
    console.log("task is in progress", task, task.status);
    await writeTasksDB(tasks);
  }

  if (!task) {
    res.status(404).send({ message: "Task not found" });
    return;
  }

  res.status(200).send(task);
};

export const markTaskAsCompleted = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params; // Get taskId from req.params

  const task = tasks.find((task) => task.id === taskId);
  if (!task) {
    res.status(404).send({ message: "Task not found" });
    return;
  }

  task.status = "done";

  await writeTasksDB(tasks);

  res.status(200).send({ message: "Task marked as completed", task });
};

export const deleteCompletedTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { taskId } = req.params;

  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex === -1) {
    res.status(404).send({ message: "Task not found" });
    return;
  }

  tasks.splice(taskIndex, 1);

  await writeTasksDB(tasks);

  res.status(200).send({ message: "Task deleted successfully" });
};
