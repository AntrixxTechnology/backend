import { Router } from 'express';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { getRepository } from '../repository/index.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Valid phone number is required'),
  company_name: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const careerSchema = z.object({
  applicant_name: z.string().min(2, 'Applicant name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Valid phone number is required'),
  role_title: z.string().min(2, 'Role title is required'),
  notes: z.string().optional(),
  resume_file_url: z.string().optional(),
});

async function sendEmailNotification(subject: string, htmlContent: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log(`[Email Mock Log] ${subject}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Antrixx Web Platform" <${user}>`,
      to: process.env.ADMIN_NOTIFICATION_EMAIL || user,
      subject,
      html: htmlContent,
    });
  } catch (err) {
    console.error('Email notification failed:', err);
  }
}

// Contact form endpoint
router.post('/contact', async (req, res) => {
  try {
    const validated = contactSchema.parse(req.body);
    const repo = getRepository();
    const submission = await repo.addContactSubmission({
      ...validated,
      status: 'unread',
    });

    sendEmailNotification(
      `New Website Contact Inquiry from ${validated.name}`,
      `<p><strong>Name:</strong> ${validated.name}</p>
       <p><strong>Email:</strong> ${validated.email}</p>
       <p><strong>Phone:</strong> ${validated.phone}</p>
       <p><strong>Company:</strong> ${validated.company_name || 'N/A'}</p>
       <p><strong>Message:</strong> ${validated.message}</p>`
    );

    res.status(201).json({
      message: 'Thank you. Your inquiry has been submitted successfully.',
      submission,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
});

// Careers application form endpoint
router.post('/careers/apply', async (req, res) => {
  try {
    const validated = careerSchema.parse(req.body);
    const repo = getRepository();
    const application = await repo.addJobApplication({
      ...validated,
      status: 'unread',
    });

    sendEmailNotification(
      `New Job Application: ${validated.role_title} - ${validated.applicant_name}`,
      `<p><strong>Applicant:</strong> ${validated.applicant_name}</p>
       <p><strong>Email:</strong> ${validated.email}</p>
       <p><strong>Phone:</strong> ${validated.phone}</p>
       <p><strong>Role:</strong> ${validated.role_title}</p>
       <p><strong>Notes:</strong> ${validated.notes || 'N/A'}</p>`
    );

    res.status(201).json({
      message: 'Thank you. Your resume application has been received.',
      application,
    });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
});

export default router;
