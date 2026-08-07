import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import publicRoutes from './routes/publicRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import statusRoute from './routes/statusRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const allowedOrigins = [
  process.env.CORS_ORIGIN_FRONTEND || 'http://localhost:5173',
  process.env.CORS_ORIGIN_ADMIN || 'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve local uploads and static files
const uploadsPath = path.resolve(process.cwd(), 'public', 'uploads');
const publicPath = path.resolve(process.cwd(), 'public');
app.use('/uploads', express.static(uploadsPath));
app.use('/public', express.static(publicPath));

// Mount Status Dashboard & API
app.use('/', statusRoute);

// Mount Business Routes
app.use('/api', publicRoutes);
app.use('/api', contactRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Antrixx Technology API Backend',
  });
});

// Only listen on a port if not running in Vercel Serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  Antrixx Technology API Server listening on port ${PORT}`);
    console.log(`  Status: http://localhost:${PORT}/status`);
    console.log(`  Healthcheck: http://localhost:${PORT}/health`);
    console.log(`=======================================================`);
  });
}

export default app;
