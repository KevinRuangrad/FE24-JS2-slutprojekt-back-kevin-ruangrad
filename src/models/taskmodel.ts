import { Category, Status } from "../controlles/tasks.js"

export interface Task {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: Status;
  timestamp: string;
  assigned?: string;
}
