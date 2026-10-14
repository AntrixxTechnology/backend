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
  process.env.CORS_ORIGIN_FRONTEND || 'https://antrixxtechnology.net',
  process.env.CORS_ORIGIN_ADMIN || 'https://admin.antrixxtechnology.net',
  'https://antrixxtechnology.net',
  'https://www.antrixxtechnology.net',
  'https://admin.antrixxtechnology.net',
  'https://api.antrixxtechnology.net',
  'https://antrixx-mainfrontend.vercel.app',
  'https://antrixx-admin.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(
  cors({
    origin: true,
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
app.use(express.static(publicPath));

// Mount Status Dashboard & API
app.use('/', statusRoute);

// Mount Business Routes
app.use('/api', publicRoutes);
app.use('/media', (req, res, next) => {
  req.url = '/media' + req.url;
  publicRoutes(req, res, next);
});
app.use('/api', contactRoutes);
app.use('/api/admin', adminRoutes);

// Healthcheck with Database Ping
app.get('/health', async (req, res) => {
  try {
    const { getRepository } = await import('./repository/index.js');
    const repo = getRepository();
    const db = repo.ping ? await repo.ping() : { ok: true, latencyMs: 0 };
    res.json({
      status: db.ok ? 'ok' : 'degraded',
      database: db,
      timestamp: new Date().toISOString(),
      service: 'Antrixx Technology API Backend',
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Periodic background DB ping for persistent Node processes (every 12 hours)
if (!process.env.VERCEL) {
  setInterval(async () => {
    try {
      const { getRepository } = await import('./repository/index.js');
      const repo = getRepository();
      if (repo.ping) {
        const pingRes = await repo.ping();
        console.log(`[KeepAlive] Background ping to ${repo.constructor.name}: ok=${pingRes.ok}, latency=${pingRes.latencyMs}ms`);
      }
    } catch (e: any) {
      console.warn(`[KeepAlive] Ping warning:`, e.message);
    }
  }, 12 * 60 * 60 * 1000);
}

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
