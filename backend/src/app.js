import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import healthRoutes from './routes/health.routes.js';
import shipmentRoutes from './routes/shipments.routes.js';
import trackingRoutes from './routes/tracking.routes.js';

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
}));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({
    message: 'Aeropaq API is running',
  });
});

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    message: 'Internal server error',
  });
});

export default app;
