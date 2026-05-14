import { Router, type Request, type Response } from 'express';
import { postgresClient } from '../config/db.config.js';

const router: Router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    await postgresClient.query('SELECT 1');
    res.status(200).json({
      status: 'OK',
      message: 'Server connected to the database',
      reason: ''
    });
  } catch (err) {
    console.error(`[SERVER ERROR - GET /health] Server disconnected from the database: ${err}`);
    res.status(503).json({
      status: 'Service Unavailable',
      message: 'Server disconnected from the database',
      reason: err
    });
  }
});

export default router;
