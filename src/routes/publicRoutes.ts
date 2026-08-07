import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import { getRepository } from '../repository/index.js';

const router = Router();

router.get('/hero', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getHero();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getStats();
    res.json(data.filter((s) => s.is_published));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/solutions', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getSolutions();
    res.json(data.filter((s) => s.is_published));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/solutions/:slug', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getSolutionBySlug(req.params.slug);
    if (!data || !data.is_published) {
      return res.status(404).json({ error: 'Solution not found' });
    }
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/industries', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getIndustries();
    res.json(data.filter((i) => i.is_published));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/projects', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getProjects();
    res.json(data.filter((p) => p.is_published));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/testimonials', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getTestimonials();
    res.json(data.filter((t) => t.is_published));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/client-logos', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getClientLogos();
    res.json(data.filter((c) => c.is_published));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/about', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getAbout();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/team', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getTeam();
    res.json(data.filter((t) => t.is_published));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/resources', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getResources();
    res.json(data.filter((r) => r.is_published));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/resources/:slug', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getResourceBySlug(req.params.slug);
    if (!data || !data.is_published) {
      return res.status(404).json({ error: 'Resource post not found' });
    }
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/job-openings', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getJobOpenings();
    res.json(data.filter((j) => j.is_published));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/faqs', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getFaqs();
    res.json(data.filter((f) => f.is_published));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/site-settings', async (req, res) => {
  try {
    const repo = getRepository();
    const data = await repo.getSiteSettings();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Profile PDF Download endpoint
router.get('/resources/downloads/profile-pdf', (req, res) => {
  const pdfPath = path.resolve(process.cwd(), 'public', 'profile.pdf');
  if (fs.existsSync(pdfPath)) {
    res.download(pdfPath, 'ANTRIXX_TECHNOLOGY_PROFILE.pdf');
  } else {
    res.status(404).json({ error: 'Corporate Profile PDF not found.' });
  }
});

export default router;
