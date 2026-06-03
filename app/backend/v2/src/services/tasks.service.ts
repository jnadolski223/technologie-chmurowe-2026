import type { QueryResult } from 'pg';
import { postgresClient } from '../config/db.config.js';
import type { Priority, Task } from '../models/index.js';

export const tasksService = {
  async getAll(): Promise<Task[]> {
    const result: QueryResult<Task> = await postgresClient.query(`
      SELECT id, content, priority, completed
      FROM tasks
    `);
    return result.rows;
  },

  async create(content: string, priority: Priority): Promise<Task> {
    const result: QueryResult<Task> = await postgresClient.query(`
      INSERT INTO tasks (content, priority)
      VALUES ($1, $2)
      RETURNING id, content, priority, completed
    `, [content, priority]);
    return result.rows[0] as Task;
  },

  async updateStatus(id: number, completed: boolean): Promise<Task | null> {
    const result: QueryResult<Task> = await postgresClient.query(`
      UPDATE tasks
      SET completed = $1
      WHERE id = $2
      RETURNING id, content, priority, completed
    `, [completed, id]);
    if (result.rowCount === 0) return null;
    return result.rows[0] as Task;
  },

  async delete(id: number): Promise<boolean> {
    const result: QueryResult<Task> = await postgresClient.query(`
      DELETE FROM tasks
      WHERE id = $1
    `, [id]);
    return result.rowCount !== 0;
  }
};
