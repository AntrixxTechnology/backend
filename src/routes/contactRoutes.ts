import { Router } from 'express';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
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

interface EmailOptions {
  from?: string;
  to?: string;
  subject: string;
  htmlContent: string;
  replyTo?: string;
}

async function sendEmailNotification({ from, to, subject, htmlContent, replyTo }: EmailOptions) {
  const resendApiKey = process.env.RESEND_API_KEY;

  const defaultFrom = process.env.RESEND_ENQUIRY_FROM || 'Antrixx Enquiries <enquiries@antrixxtechnology.net>';
  const defaultTo = process.env.ADMIN_NOTIFICATION_EMAIL || 'help@antrixxtechnology.net';

  const sender = from || defaultFrom;
  const recipient = to || defaultTo;

  // 1. Prioritize Resend (Native Serverless HTTP API for Vercel)
  if (resendApiKey) {
    try {
      const resend = new Resend(resendApiKey);

      let { data, error } = await resend.emails.send({
        from: sender,
        to: recipient,
        replyTo: replyTo,
        subject,
        html: htmlContent,
      });

      // Graceful fallback to onboarding@resend.dev if domain is not yet verified in Resend dashboard
      if (error && error.message && error.message.toLowerCase().includes('not verified')) {
        console.warn(`[Resend Notice] "${sender}" domain is not yet verified in resend.com/domains. Falling back to verified test sender for delivery.`);
        const fallbackResult = await resend.emails.send({
          from: 'Antrixx Technology <onboarding@resend.dev>',
          to: recipient,
          replyTo: replyTo,
          subject: `[Antrixx] ${subject}`,
          html: htmlContent,
        });
        data = fallbackResult.data;
        error = fallbackResult.error;
      }

      if (error) {
        console.error('[Resend Error]:', error);
      } else {
        console.log(`[Resend Success]: Email "${subject}" sent to ${recipient} (ID: ${data?.id})`);
        return;
      }
    } catch (err) {
      console.error('[Resend Exception]:', err);
    }
  }

  // 2. Fallback to Nodemailer SMTP if configured
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: { user, pass },
      });

      await transporter.sendMail({
        from: sender,
        to: recipient,
        replyTo,
        subject,
        html: htmlContent,
      });
      console.log(`[SMTP Success]: Email dispatched to ${recipient}`);
      return;
    } catch (err) {
      console.error('[SMTP Error]: Email notification failed:', err);
    }
  }

  console.log(`[Email Log]: Provider not ready. Sent "${subject}" to ${recipient}`);
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

    const inquiryFrom = process.env.RESEND_ENQUIRY_FROM || 'Antrixx Enquiries <enquiries@antrixxtechnology.net>';
    const doNotReplyFrom = process.env.RESEND_NOREPLY_FROM || 'Antrixx Technology <donotreply@antrixxtechnology.net>';
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'help@antrixxtechnology.net';
    const refCode = submission?.id ? `ATX-ENQ-${String(submission.id).slice(0, 8).toUpperCase()}` : `ATX-ENQ-${Date.now().toString(36).toUpperCase()}`;
    const timestampStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    // 1. Email to Admin / Team (Lead Alert)
    sendEmailNotification({
      from: inquiryFrom,
      to: adminEmail,
      subject: `🚨 [New Lead] ${validated.name} - ${validated.company_name || 'Individual'} (${refCode})`,
      replyTo: validated.email,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px 28px; border-bottom: 3px solid #0284c7;">
              <span style="display: inline-block; background-color: #0284c7; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 4px; margin-bottom: 8px;">New Inbound Lead</span>
              <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700; letter-spacing: -0.3px;">Website Contact Inquiry</h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Reference ID: <strong style="color: #38bdf8;">${refCode}</strong></p>
            </div>

            <!-- Content Body -->
            <div style="padding: 28px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b; width: 140px;"><strong>Client Name:</strong></td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 700; font-size: 15px;">${validated.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Company:</strong></td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 600;">${validated.company_name || 'Individual / Not specified'}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Email Address:</strong></td>
                  <td style="padding: 10px 0;"><a href="mailto:${validated.email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${validated.email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Phone Number:</strong></td>
                  <td style="padding: 10px 0;"><a href="tel:${validated.phone}" style="color: #0f172a; text-decoration: none; font-weight: 600;">${validated.phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #64748b;"><strong>Received At:</strong></td>
                  <td style="padding: 10px 0; color: #475569;">${timestampStr} IST</td>
                </tr>
              </table>

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0284c7; border-radius: 6px; padding: 18px 20px; margin-bottom: 24px;">
                <strong style="color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 8px;">Customer Requirement / Message:</strong>
                <p style="white-space: pre-wrap; margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">${validated.message}</p>
              </div>

              <div style="background-color: #ecfeff; border: 1px solid #a5f3fc; border-radius: 8px; padding: 16px 20px; text-align: center;">
                <p style="margin: 0 0 12px 0; color: #0e7490; font-size: 13px; font-weight: 600;">Direct reply will go straight to the customer's inbox:</p>
                <a href="mailto:${validated.email}?subject=Re:%20Antrixx%20Technology%20Inquiry%20[${refCode}]" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 13px; padding: 10px 24px; border-radius: 6px;">Reply to ${validated.name} &rarr;</a>
              </div>
            </div>

            <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; text-align: center; color: #94a3b8; font-size: 12px;">
              Antrixx Technology Lead Notification System &bull; <a href="https://antrixxtechnology.net" style="color: #64748b; text-decoration: none;">antrixxtechnology.net</a>
            </div>

          </div>
        </body>
        </html>
      `,
    });

    // 2. Auto-Acknowledgement Email to Customer (with prominent DO NOT REPLY banner)
    sendEmailNotification({
      from: doNotReplyFrom,
      to: validated.email,
      replyTo: adminEmail,
      subject: `We Have Received Your Inquiry [Ref: ${refCode}] - Antrixx Technology`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">

            <!-- Prominent DO NOT REPLY Banner at Top -->
            <div style="background-color: #fef2f2; border-bottom: 2px solid #fecaca; padding: 14px 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 28px; vertical-align: middle; font-size: 20px;">⚠️</td>
                  <td style="color: #991b1b; font-size: 12px; line-height: 1.5; padding-left: 6px;">
                    <strong style="text-transform: uppercase; letter-spacing: 0.5px;">Automated Delivery &mdash; Please Do Not Reply:</strong><br />
                    This message was sent from an unattended notification address (<strong>donotreply@antrixxtechnology.net</strong>). Direct replies to this email are not monitored. To speak with our team, please contact <a href="mailto:${adminEmail}" style="color: #dc2626; text-decoration: underline; font-weight: 700;">${adminEmail}</a>.
                  </td>
                </tr>
              </table>
            </div>

            <!-- Brand Header -->
            <div style="background: linear-gradient(135deg, #0b1329 0%, #1e293b 100%); padding: 32px 28px; text-align: center; border-bottom: 3px solid #0284c7;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px;">ANTRIXX TECHNOLOGY</h1>
              <p style="color: #38bdf8; font-size: 12px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Integrated Industrial & Environmental Solutions</p>
            </div>

            <!-- Body Content -->
            <div style="padding: 32px 28px;">
              <p style="color: #0f172a; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">Dear ${validated.name},</p>

              <p style="color: #334155; font-size: 14.5px; line-height: 1.65; margin: 0 0 20px 0;">
                Thank you for reaching out to <strong>Antrixx Technology</strong>. We have successfully logged your inquiry regarding our industrial engineering solutions under Reference ID <strong style="color: #0284c7;">${refCode}</strong>.
              </p>

              <!-- Progress / What Happens Next Steps -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 14px 0; color: #0f172a; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">What Happens Next?</p>
                
                <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
                  <tr>
                    <td style="width: 32px; vertical-align: top; color: #0284c7; font-weight: 800; font-size: 16px;">1.</td>
                    <td style="padding-bottom: 12px; color: #334155;">
                      <strong>Inquiry Logged & Assigned:</strong> Your project requirements have been routed to our dedicated solutions team.
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 32px; vertical-align: top; color: #0284c7; font-weight: 800; font-size: 16px;">2.</td>
                    <td style="padding-bottom: 12px; color: #334155;">
                      <strong>Technical Assessment:</strong> Our senior engineering specialists are reviewing your parameters and application needs.
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 32px; vertical-align: top; color: #0284c7; font-weight: 800; font-size: 16px;">3.</td>
                    <td style="color: #334155;">
                      <strong>Direct Contact within 24 Hours:</strong> A technical representative will reach out via phone or email to discuss technical specifications and proposal details.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Summary of Submitted Inquiry -->
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-left: 4px solid #0f172a; border-radius: 6px; padding: 16px 18px; margin-bottom: 28px;">
                <strong style="color: #64748b; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Summary of Your Submission:</strong>
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #0f172a;"><strong>Company:</strong> ${validated.company_name || 'N/A'}</p>
                <p style="white-space: pre-wrap; margin: 0; color: #475569; font-size: 13.5px; line-height: 1.5; font-style: italic;">&ldquo;${validated.message}&rdquo;</p>
              </div>

              <!-- Need Assistance Box -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13.5px; color: #475569; line-height: 1.6;">
                <p style="margin: 0 0 6px 0; color: #0f172a; font-weight: 700;">Need Immediate Assistance?</p>
                <p style="margin: 0;">
                  If your project requires urgent consultation, please reach out directly to our support desk at <a href="mailto:${adminEmail}" style="color: #0284c7; font-weight: 600; text-decoration: none;">${adminEmail}</a> quoting reference <strong>${refCode}</strong>.
                </p>
              </div>

              <!-- Signoff -->
              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
                <p style="color: #64748b; font-size: 13.5px; margin: 0; line-height: 1.5;">
                  Warm regards,<br>
                  <strong style="color: #0f172a; font-size: 14px;">Technical Sales & Engineering Division</strong><br>
                  <span style="color: #0284c7; font-weight: 600;">Antrixx Technology</span>
                </p>
              </div>
            </div>

            <!-- Footer with DO NOT REPLY Disclaimer -->
            <div style="background-color: #0f172a; color: #94a3b8; padding: 24px 28px; text-align: center; font-size: 12px; line-height: 1.6;">
              <p style="color: #cbd5e1; font-weight: 600; margin: 0 0 4px 0;">ANTRIXX TECHNOLOGY</p>
              <p style="margin: 0 0 12px 0; color: #64748b;">Industrial Air Pollution Control &bull; Thermal Equipment Retrofits &bull; Bulk Material Handling</p>
              
              <div style="margin: 12px 0; padding: 10px 16px; background-color: rgba(255,255,255,0.05); border-radius: 6px; font-size: 11px; color: #94a3b8;">
                🚫 <strong>DO NOT REPLY:</strong> This message was sent from an automated notification address (<strong>donotreply@antrixxtechnology.net</strong>) that cannot receive incoming mail.
              </div>

              <p style="margin: 0; color: #475569; font-size: 11px;">
                &copy; ${new Date().getFullYear()} Antrixx Technology. All rights reserved. &bull; <a href="https://antrixxtechnology.net" style="color: #38bdf8; text-decoration: none;">antrixxtechnology.net</a>
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    });

    res.status(201).json({
      message: 'Thank you. Your inquiry has been submitted successfully.',
      submission,
      referenceId: refCode,
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

    const careerFrom = process.env.RESEND_CAREERS_FROM || 'Antrixx Careers <careers@antrixxtechnology.net>';
    const doNotReplyFrom = process.env.RESEND_NOREPLY_FROM || 'Antrixx Technology <donotreply@antrixxtechnology.net>';
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'help@antrixxtechnology.net';
    const refCode = application?.id ? `ATX-APP-${String(application.id).slice(0, 8).toUpperCase()}` : `ATX-APP-${Date.now().toString(36).toUpperCase()}`;
    const timestampStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    // 1. Email to HR / Admin
    sendEmailNotification({
      from: careerFrom,
      to: adminEmail,
      subject: `💼 [Career Application] ${validated.role_title} - ${validated.applicant_name} (${refCode})`,
      replyTo: validated.email,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px 12px;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            
            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 24px 28px; border-bottom: 3px solid #0284c7;">
              <span style="display: inline-block; background-color: #0284c7; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 4px; margin-bottom: 8px;">Talent Acquisition</span>
              <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">New Career Application Received</h1>
              <p style="color: #94a3b8; font-size: 13px; margin: 4px 0 0 0;">Application Ref: <strong style="color: #38bdf8;">${refCode}</strong></p>
            </div>

            <div style="padding: 28px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b; width: 140px;"><strong>Applicant Name:</strong></td>
                  <td style="padding: 10px 0; color: #0f172a; font-weight: 700; font-size: 15px;">${validated.applicant_name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Role Applied:</strong></td>
                  <td style="padding: 10px 0; color: #0284c7; font-weight: 700;">${validated.role_title}</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Email:</strong></td>
                  <td style="padding: 10px 0;"><a href="mailto:${validated.email}" style="color: #0284c7; text-decoration: none; font-weight: 600;">${validated.email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Phone:</strong></td>
                  <td style="padding: 10px 0;"><a href="tel:${validated.phone}" style="color: #0f172a; text-decoration: none; font-weight: 600;">${validated.phone}</a></td>
                </tr>
                ${validated.resume_file_url ? `
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 10px 0; color: #64748b;"><strong>Attached Resume:</strong></td>
                  <td style="padding: 10px 0;"><a href="${validated.resume_file_url}" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 4px;">Download Resume 📄</a></td>
                </tr>` : ''}
                <tr>
                  <td style="padding: 10px 0; color: #64748b;"><strong>Applied On:</strong></td>
                  <td style="padding: 10px 0; color: #475569;">${timestampStr} IST</td>
                </tr>
              </table>

              ${validated.notes ? `
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #0284c7; border-radius: 6px; padding: 16px 18px;">
                <strong style="color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Applicant Notes / Cover Summary:</strong>
                <p style="white-space: pre-wrap; margin: 0; color: #334155; font-size: 14px; line-height: 1.5;">${validated.notes}</p>
              </div>` : ''}
            </div>

            <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; text-align: center; color: #94a3b8; font-size: 12px;">
              Antrixx Technology Talent Acquisition Portal &bull; <a href="https://antrixxtechnology.net" style="color: #64748b; text-decoration: none;">antrixxtechnology.net</a>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // 2. Auto-Acknowledgement Email to Applicant (with prominent DO NOT REPLY banner)
    sendEmailNotification({
      from: doNotReplyFrom,
      to: validated.email,
      replyTo: adminEmail,
      subject: `Application Received: ${validated.role_title} [Ref: ${refCode}] - Antrixx Technology`,
      htmlContent: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 12px;">
          <div style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">

            <!-- Prominent DO NOT REPLY Banner at Top -->
            <div style="background-color: #fef2f2; border-bottom: 2px solid #fecaca; padding: 14px 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="width: 28px; vertical-align: middle; font-size: 20px;">⚠️</td>
                  <td style="color: #991b1b; font-size: 12px; line-height: 1.5; padding-left: 6px;">
                    <strong style="text-transform: uppercase; letter-spacing: 0.5px;">Automated Delivery &mdash; Please Do Not Reply:</strong><br />
                    This is an automated application confirmation from an unattended mailbox (<strong>donotreply@antrixxtechnology.net</strong>). Direct replies are not monitored. For HR queries, contact <a href="mailto:${adminEmail}" style="color: #dc2626; text-decoration: underline; font-weight: 700;">${adminEmail}</a>.
                  </td>
                </tr>
              </table>
            </div>

            <!-- Brand Header -->
            <div style="background: linear-gradient(135deg, #0b1329 0%, #1e293b 100%); padding: 32px 28px; text-align: center; border-bottom: 3px solid #0284c7;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px;">ANTRIXX TECHNOLOGY</h1>
              <p style="color: #38bdf8; font-size: 12px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">Careers & Talent Acquisition</p>
            </div>

            <!-- Body Content -->
            <div style="padding: 32px 28px;">
              <p style="color: #0f172a; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">Dear ${validated.applicant_name},</p>

              <p style="color: #334155; font-size: 14.5px; line-height: 1.65; margin: 0 0 20px 0;">
                Thank you for applying for the position of <strong style="color: #0284c7;">${validated.role_title}</strong> at Antrixx Technology. We have safely received your profile and credentials under Application Reference <strong style="color: #0f172a;">${refCode}</strong>.
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 10px 0; color: #0f172a; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Recruitment Process & Next Steps:</p>
                <p style="color: #334155; font-size: 13.5px; line-height: 1.6; margin: 0 0 10px 0;">
                  Our Human Resources & Technical Recruitment panel is currently screening submissions against role prerequisites and core project requirements.
                </p>
                <p style="color: #334155; font-size: 13.5px; line-height: 1.6; margin: 0;">
                  If your qualifications, technical background, and experience align with our requirements, our recruitment team will reach out directly to schedule an initial discussion.
                </p>
              </div>

              <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f1f5f9;">
                <p style="color: #64748b; font-size: 13.5px; margin: 0; line-height: 1.5;">
                  Best regards and good luck,<br>
                  <strong style="color: #0f172a; font-size: 14px;">Talent Acquisition Team</strong><br>
                  <span style="color: #0284c7; font-weight: 600;">Antrixx Technology</span>
                </p>
              </div>
            </div>

            <!-- Footer with DO NOT REPLY Notice -->
            <div style="background-color: #0f172a; color: #94a3b8; padding: 24px 28px; text-align: center; font-size: 12px; line-height: 1.6;">
              <p style="color: #cbd5e1; font-weight: 600; margin: 0 0 4px 0;">ANTRIXX TECHNOLOGY &bull; CAREERS</p>
              
              <div style="margin: 12px 0; padding: 10px 16px; background-color: rgba(255,255,255,0.05); border-radius: 6px; font-size: 11px; color: #94a3b8;">
                🚫 <strong>DO NOT REPLY:</strong> This is an automated email confirmation sent from <strong>donotreply@antrixxtechnology.net</strong>. Direct replies will not be received.
              </div>

              <p style="margin: 0; color: #475569; font-size: 11px;">
                &copy; ${new Date().getFullYear()} Antrixx Technology. All rights reserved. &bull; <a href="https://antrixxtechnology.net" style="color: #38bdf8; text-decoration: none;">antrixxtechnology.net</a>
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    });

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
