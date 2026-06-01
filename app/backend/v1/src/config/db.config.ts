import { Pool } from 'pg';
import { config } from './env.config.js';

export const postgresClient = new Pool({
  host: config.postgres.host,
  port: config.postgres.port,
  database: config.postgres.database,
  user: config.postgres.user,
  password: config.postgres.password
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await postgresClient.query(`
      CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          content VARCHAR(255) NOT NULL,
          completed BOOLEAN DEFAULT false
      );
    `);

    console.log('Table "tasks" is ready');
  } catch (err) {
    throw new Error(`Failed to create table "tasks": ${err}`);
  }
};
