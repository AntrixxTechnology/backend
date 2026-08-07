import { Router } from 'express';

const router = Router();
const startTime = Date.now();

router.get('/api/status', (req, res) => {
  res.json({
    status: 'ONLINE',
    server: 'Antrixx Technology API Backend',
    port: process.env.PORT || 5000,
    uptime_seconds: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
  });
});

router.get(['/', '/status'], (req, res) => {
  const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
  const mins = Math.floor(uptimeSec / 60);
  const secs = uptimeSec % 60;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Antrixx Technology API Server</title>
  <link rel="icon" type="image/png" href="/logo.png" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&family=Manrope:wght@800&display=swap" rel="stylesheet">
  <style>
    body { background-color: #081A2B; color: #FFFFFF; font-family: 'Inter', sans-serif; }
    h1 { font-family: 'Manrope', sans-serif; }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-md bg-[#111827] rounded-2xl p-8 border border-slate-700 shadow-2xl text-center space-y-6">
    <img src="/logo.png" alt="Antrixx Logo" class="h-10 mx-auto object-contain" onerror="this.style.display='none'" />
    
    <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
      <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
      SERVER ONLINE & OPERATIONAL
    </div>

    <div class="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
      <p class="flex justify-between"><span>Service:</span> <strong class="text-white">Antrixx API Backend</strong></p>
      <p class="flex justify-between"><span>Status:</span> <strong class="text-emerald-400">200 OK</strong></p>
      <p class="flex justify-between"><span>Port:</span> <strong class="text-white">5000</strong></p>
      <p class="flex justify-between"><span>Uptime:</span> <strong class="text-white">${mins}m ${secs}s</strong></p>
    </div>
  </div>
</body>
</html>`;
  res.send(html);
});

export default router;
