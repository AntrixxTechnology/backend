import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { authenticateAdmin, AuthRequest } from '../middleware/authMiddleware.js';
import { getRepository } from '../repository/index.js';
import { getStorageProvider } from '../storage/index.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Single Admin Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const allowedEmails = ['admin@antrixx.com', 'admin@antrixxtechnology.com', process.env.ADMIN_EMAIL].filter(Boolean);

  if (!allowedEmails.includes(email)) {
    return res.status(401).json({ error: 'Invalid admin email credentials' });
  }

  const hardcodedHash = process.env.ADMIN_PASSWORD_HASH;
  let isValid = false;

  if (hardcodedHash) {
    isValid = await bcrypt.compare(password, hardcodedHash);
  } else {
    isValid = password === 'AntrixxAdmin2026!' || password === 'AdminPassword123!' || password === 'AntrixxAdmin2026';
  }

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid admin password' });
  }

  const secret = process.env.JWT_SECRET || 'antrixx_super_secret_jwt_key_2026_industrial_b2b';
  const token = jwt.sign({ email, role: 'admin' }, secret, { expiresIn: '7d' });

  res.json({
    message: 'Admin authentication successful',
    token,
    user: { email, role: 'admin' },
  });
});

// Admin Health Endpoint
router.get('/health', authenticateAdmin, (req: AuthRequest, res) => {
  res.json({ status: 'ok', admin: req.user?.email });
});

// File Upload Endpoint
router.post('/upload', authenticateAdmin, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const bucket = req.body.bucket || 'general';
    const storage = getStorageProvider();
    const fileUrl = await storage.uploadFile(req.file, bucket);
    res.json({ url: fileUrl });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Solutions Management
router.get('/solutions', authenticateAdmin, async (req, res) => {
  const repo = getRepository();
  res.json(await repo.getSolutions());
});

router.post('/solutions', authenticateAdmin, async (req, res) => {
  const repo = getRepository();
  res.json(await repo.saveSolution(req.body));
});

router.put('/solutions/:id', authenticateAdmin, async (req, res) => {
  const repo = getRepository();
  res.json(await repo.saveSolution(req.body));
});

router.delete('/solutions/:id', authenticateAdmin, async (req, res) => {
  const repo = getRepository();
  res.json({ success: await repo.deleteSolution(req.params.id) });
});

// Inquiries / Leads Management
const getInquiriesHandler = async (req: any, res: any) => {
  const repo = getRepository();
  res.json(await repo.getContactSubmissions());
};

router.get('/inquiries', authenticateAdmin, getInquiriesHandler);
router.get('/submissions/contact', authenticateAdmin, getInquiriesHandler);

const exportInquiriesCsvHandler = async (req: any, res: any) => {
  const repo = getRepository();
  const list = await repo.getContactSubmissions();

  const headers = ['ID', 'Date', 'Name', 'Email', 'Phone', 'Company', 'Message', 'Status'];
  const rows = list.map((c) => [
    c.id,
    c.created_at,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${c.email || ''}"`,
    `"${c.phone || ''}"`,
    `"${(c.company_name || '').replace(/"/g, '""')}"`,
    `"${(c.message || '').replace(/"/g, '""')}"`,
    c.status || 'NEW',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="contact_submissions.csv"');
  res.send(csvContent);
};

router.get('/inquiries/export-csv', authenticateAdmin, exportInquiriesCsvHandler);
router.get('/submissions/contact/export/csv', authenticateAdmin, exportInquiriesCsvHandler);

// Job Applications Management
const getApplicationsHandler = async (req: any, res: any) => {
  const repo = getRepository();
  res.json(await repo.getJobApplications());
};

router.get('/applications', authenticateAdmin, getApplicationsHandler);
router.get('/job-applications', authenticateAdmin, getApplicationsHandler);

const exportApplicationsCsvHandler = async (req: any, res: any) => {
  const repo = getRepository();
  const list = await repo.getJobApplications();

  const headers = ['ID', 'Date', 'Applicant Name', 'Email', 'Phone', 'Role Title', 'Notes', 'Status'];
  const rows = list.map((j) => [
    j.id,
    j.created_at,
    `"${(j.applicant_name || '').replace(/"/g, '""')}"`,
    `"${j.email || ''}"`,
    `"${j.phone || ''}"`,
    `"${(j.role_title || '').replace(/"/g, '""')}"`,
    `"${(j.notes || '').replace(/"/g, '""')}"`,
    j.status || 'NEW',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="job_applications.csv"');
  res.send(csvContent);
};

router.get('/applications/export-csv', authenticateAdmin, exportApplicationsCsvHandler);
router.get('/submissions/careers/export/csv', authenticateAdmin, exportApplicationsCsvHandler);

// --- Hero Content ---
router.get('/hero', authenticateAdmin, async (req, res) => {
  res.json(await getRepository().getHero());
});
router.put('/hero', authenticateAdmin, async (req, res) => {
  res.json(await getRepository().updateHero(req.body));
});

// --- About Content ---
router.get('/about', authenticateAdmin, async (req, res) => {
  res.json(await getRepository().getAbout());
});
router.put('/about', authenticateAdmin, async (req, res) => {
  res.json(await getRepository().updateAbout(req.body));
});

// --- Site Settings ---
router.get('/settings', authenticateAdmin, async (req, res) => {
  res.json(await getRepository().getSiteSettings());
});
router.put('/settings', authenticateAdmin, async (req, res) => {
  res.json(await getRepository().updateSiteSettings(req.body));
});

// --- Stats ---
router.get('/stats', authenticateAdmin, async (req, res) => {
  res.json(await getRepository().getStats());
});
router.put('/stats', authenticateAdmin, async (req, res) => {
  res.json(await getRepository().saveStats(req.body));
});

// --- Generic CRUD Factory ---
const createCrudRoutes = (pathBase: string, getMethod: string, saveMethod: string, deleteMethod: string) => {
  router.get(pathBase, authenticateAdmin, async (req, res) => {
    const repo = getRepository() as any;
    res.json(await repo[getMethod]());
  });
  router.post(pathBase, authenticateAdmin, async (req, res) => {
    const repo = getRepository() as any;
    res.json(await repo[saveMethod](req.body));
  });
  router.put(`${pathBase}/:id`, authenticateAdmin, async (req, res) => {
    const repo = getRepository() as any;
    res.json(await repo[saveMethod](req.body));
  });
  router.delete(`${pathBase}/:id`, authenticateAdmin, async (req, res) => {
    const repo = getRepository() as any;
    res.json({ success: await repo[deleteMethod](req.params.id) });
  });
};

createCrudRoutes('/industries', 'getIndustries', 'saveIndustry', 'deleteIndustry');
createCrudRoutes('/projects', 'getProjects', 'saveProject', 'deleteProject');
createCrudRoutes('/client-logos', 'getClientLogos', 'saveClientLogo', 'deleteClientLogo');
createCrudRoutes('/team', 'getTeam', 'saveTeamMember', 'deleteTeamMember');
createCrudRoutes('/resources', 'getResources', 'saveResource', 'deleteResource');
createCrudRoutes('/faqs', 'getFaqs', 'saveFaq', 'deleteFaq');
createCrudRoutes('/job-openings', 'getJobOpenings', 'saveJobOpening', 'deleteJobOpening');
createCrudRoutes('/blogs', 'getBlogs', 'saveBlog', 'deleteBlog');
createCrudRoutes('/erp-clients', 'getErpClients', 'saveErpClient', 'deleteErpClient');
createCrudRoutes('/erp-transactions', 'getErpTransactions', 'saveErpTransaction', 'deleteErpTransaction');
createCrudRoutes('/erp-invoices', 'getErpInvoices', 'saveErpInvoice', 'deleteErpInvoice');

export default router;
