import { Router } from "express";
import { addTask, getTasks, deleteTask, updateTask } from "../controlles/tasks.js";

const router = Router();

router.post('/task', addTask);
router.get('/task', getTasks);
router.delete('/task/:id', deleteTask)
router.patch('/task/:id', updateTask)

export default router;