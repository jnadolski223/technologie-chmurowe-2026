import type { QueryResult } from 'pg';
import { postgresClient } from '../config/db.config.js';
import type { Task } from '../models/task.model.js';

export const tasksService = {
  async getAll(): Promise<Task[]> {
    const result: QueryResult<Task> = await postgresClient.query(`
      SELECT id, content, completed
      FROM tasks
    `);
    return result.rows;
  },

  async create(content: string): Promise<Task> {
    const result: QueryResult<Task> = await postgresClient.query(`
      INSERT INTO tasks (content)
      VALUES ($1)
      RETURNING id, content, completed
    `, [content]);
    return result.rows[0] as Task;
  },

  async updateStatus(id: number, completed: boolean): Promise<Task | null> {
    const result: QueryResult<Task> = await postgresClient.query(`
      UPDATE tasks
      SET completed = $1
      WHERE id = $2
      RETURNING id, content, completed
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
