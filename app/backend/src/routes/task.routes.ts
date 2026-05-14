import { Router, type Request, type Response } from 'express';
import { postgresClient } from '../config/db.config.js';
import type { QueryResult } from 'pg';

const router: Router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result: QueryResult = await postgresClient.query('SELECT * FROM tasks');
    res.status(200).json({
      status: 'OK',
      message: 'Tasks fetched successfully',
      tasks: result.rows
    });
  } catch (err) {
    console.error(`[SERVER ERROR - GET /tasks] Failed to fetch tasks: ${err}`);
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to fetch tasks',
      reason: err
    });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to create a task',
      reason: 'Body cannot be empty'
    });
    return;
  }

  if (!('content' in req.body)) {
    res.status(422).json({
      status: 'Unprocessable Entity',
      message: 'Failed to create a task',
      reason: "Missing required field: 'content'"
    });
    return;
  }

  const { content } = req.body;
  if (String(content).trim().length === 0) {
    res.status(422).json({
      status: 'Unprocessable Entity',
      message: 'Failed to create a task',
      reason: "Field 'content' cannot be empty"
    });
    return;
  }

  try {
    const result: QueryResult = await postgresClient.query(
      'INSERT INTO tasks (content) VALUES ($1) RETURNING *',
      [content]
    );

    res.status(201).json({
      status: 'Created',
      message: 'Task created successfully',
      task: result.rows[0]
    });
  } catch (err) {
    console.error(`[SERVER ERROR - POST /tasks] Failed to create a task: ${err}`);
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to create a task',
      reason: err
    });
  }
});

router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to update the task',
      reason: 'Body cannot be empty'
    });
    return;
  }

  const { id } = req.params;
  const taskId: number = parseInt(String(id), 10);
  if (isNaN(taskId)) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'Failed to update the task',
      reason: 'Invalid format - ID must be a valid number'
    });
    return;
  }

  if (!('completed' in req.body)) {
    res.status(422).json({
      status: 'Unprocessable Entity',
      message: 'Failed to update the task',
      reason: "Missing required field: 'completed'"
    });
    return;
  }

  const { completed } = req.body;
  if (typeof completed !== 'boolean') {
    res.status(422).json({
      status: 'Unprocessable Entity',
      message: 'Failed to update the task',
      reason: "Field 'completed' must be a boolean"
    });
    return;
  }

  try {
    const result: QueryResult = await postgresClient.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, taskId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        status: 'Not Found',
        message: 'Failed to update the task',
        reason: `Task with ID ${taskId} not found in the database`
      });
      return;
    }

    res.status(200).json({
      status: 'OK',
      message: 'Task updated successfully',
      task: result.rows[0]
    });
  } catch (err) {
    console.error(`[SERVER ERROR - PATCH /tasks/:id] Failed to update the task: ${err}`);
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to update the task',
      reason: err
    });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const taskId: number = parseInt(String(id), 10);
  if (isNaN(taskId)) {
    res.status(400).json({
      status: 'Bad Request',
      message: 'Failed to delete the task',
      reason: 'Invalid format - ID must be a valid number'
    });
    return;
  }

  try {
    const result: QueryResult = await postgresClient.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [taskId]
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        status: 'Not Found',
        message: 'Failed to delete the task',
        reason: `Task with ID ${taskId} not found in the database`
      });
      return;
    }

    res.status(204).send();
  } catch (err) {
    console.error(`[SERVER ERROR - DELETE /tasks/:id] Failed to delete the task: ${err}`);
    res.status(500).json({
      status: 'Internal Server Error',
      message: 'Failed to delete the task',
      reason: err
    });
  }
});

export default router;
