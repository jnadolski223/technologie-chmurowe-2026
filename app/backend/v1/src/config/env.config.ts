import { validateEnvironmentVariable } from '../utils/validateEnvironmentVariable.util.js';

export const config = {
  postgres: {
    host: validateEnvironmentVariable<string>('DB_HOST', 'string'),
    port: validateEnvironmentVariable<number>('DB_PORT', 'number'),
    database: validateEnvironmentVariable<string>('DB_NAME', 'string'),
    user: validateEnvironmentVariable<string>('DB_USER', 'string'),
    password: validateEnvironmentVariable<string>('DB_PASSWORD', 'string')
  }
};
