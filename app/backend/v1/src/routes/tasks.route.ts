import { Router, type Request, type Response } from 'express';
import { tasksService } from '../services/tasks.service.js';
import type { Task } from '../models/task.model.js';

const router: Router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const tasks: Task[] = await tasksService.getAll();
    res.status(200).json({
      status: 'OK',
      message: 'Tasks fetched successfully',
      data: tasks
    });
  } catch (err) {
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to fetch tasks',
      reason: `${err}`
    });
    throw new Error(`[GET /tasks] Failed to fetch tasks: ${err}`);
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'Failed to create a new task',
      reason: `Body cannot be empty`
    });
    return;
  }

  if (!('content' in req.body)) {
    res.status(422).json({
      status: 'Unprocessable Entity',
      message: 'Failed to create a new task',
      reason: `Missing required field: 'content'`
    });
    return;
  }

  const content: string = String(req.body.content);
  if (content.trim().length === 0) {
    res.status(422).json({
      status: 'Unprocessable Entity',
      message: 'Failed to create a new task',
      reason: `Field 'content' cannot be empty`
    });
    return;
  }

  try {
    const createdTask: Task = await tasksService.create(content);
    res.status(201).json({
      status: 'Created',
      message: 'New task created successfully',
      data: createdTask
    });
  } catch (err) {
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to create a new task',
      reason: `${err}`
    });
    throw new Error(`[POST /tasks] Failed to create a new task: ${err}`);
  }
});

router.patch('/:taskId', async (req: Request, res: Response): Promise<void> => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'Failed to update the task',
      reason: `Body cannot be empty`
    });
    return;
  }

  const { taskId } = req.params;
  const parsedTaskId: number = parseInt(String(taskId), 10);
  if (isNaN(parsedTaskId)) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'Failed to update the task',
      reason: `Invalid ID format - must be a number`
    });
    return;
  }

  if (!('completed' in req.body)) {
    res.status(422).json({
      status: 'Unprocessable Entity',
      message: 'Failed to update the task',
      reason: `Missing required field: 'completed'`
    });
    return;
  }

  const { completed } = req.body;
  if (typeof completed !== 'boolean') {
    res.status(422).json({
      status: 'Unprocessable Entity',
      message: 'Failed to update the task',
      reason: `Field 'completed' must be a boolean`
    });
    return;
  }

  try {
    const updatedTask: Task | null = await tasksService.updateStatus(parsedTaskId, completed);
    if (!updatedTask) {
      res.status(404).json({
        status: 'Not Found',
        message: 'Failed to update the task',
        reason: `Task with ID ${parsedTaskId} not found`
      });
      return;
    }

    res.status(200).json({
      status: 'OK',
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (err) {
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to update the task',
      reason: `${err}`
    });
    throw new Error(`[PATCH /tasks/:${parsedTaskId}] Failed to update the task: ${err}`);
  }
});

router.delete(':/taskId', async (req: Request, res: Response): Promise<void> => {
  const { taskId } = req.params;
  const parsedTaskId: number = parseInt(String(taskId), 10);
  if (isNaN(parsedTaskId)) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'Failed to delete the task',
      reason: `Invalid ID format - must be a number`
    });
    return;
  }

  try {
    const isDeleted: boolean = await tasksService.delete(parsedTaskId);
    if (!isDeleted) {
      res.status(404).json({
        status: 'Not Found',
        message: 'Failed to delete the task',
        reason: `Task with ID ${parsedTaskId} not found`
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to delete the task',
      reason: `${err}`
    });
    throw new Error(`[DELETE /tasks/:${parsedTaskId}] Failed to delete the task: ${err}`);
  }
});

export default router;
