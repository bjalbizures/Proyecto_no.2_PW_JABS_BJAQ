import { Router } from 'express';

import { pool } from '../config/db.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'aeropaq-api',
  });
});

router.get('/db', async (_req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS connected');

    res.json({
      status: 'ok',
      database: rows[0],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
