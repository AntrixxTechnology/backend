import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  ContentRepository,
  HeroContent,
  StatItem,
  SolutionItem,
  IndustryItem,
  ProjectItem,
  TestimonialItem,
  ClientLogoItem,
  AboutContent,
  TeamMember,
  ResourcePost,
  JobOpening,
  JobApplication,
  FaqItem,
  ContactSubmission,
  SiteSettings,
} from './types.js';

export class LocalJsonRepository implements ContentRepository {
  private dataDir: string;

  constructor() {
    this.dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private readJson<T>(filename: string, defaultValue: T): T {
    const filePath = path.join(this.dataDir, filename);
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content) as T;
    } catch (err) {
      console.error(`Error reading ${filename}:`, err);
      return defaultValue;
    }
  }

  private writeJson<T>(filename: string, data: T): void {
    const filePath = path.join(this.dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  async getHero(): Promise<HeroContent> {
    return this.readJson<HeroContent>('hero.json', {
      id: 'hero-1',
      badge: 'INDUSTRIAL AUTOMATION & ENERGY SOLUTIONS',
      headline: 'Engineering Intelligence.',
      accent_text: 'Powering Industries.',
      description: 'Antrixx Technology delivers high-efficiency boiler house automation, utility remote monitoring, pollution control systems, and balance-of-plant management tailored for enterprise manufacturing.',
      primary_cta_text: 'Explore Engineering Solutions',
      primary_cta_link: '/solutions',
      secondary_cta_text: 'Download Corporate Profile',
      secondary_cta_link: '/resources/downloads',
      background_image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1920&auto=format&fit=crop',
      scada_plant_efficiency: 94,
      scada_steam_flow: 14.8,
      scada_fuel_consumption: 850,
      scada_energy_saved_mwh: 1240,
      is_published: true,
    });
  }

  async updateHero(data: Partial<HeroContent>): Promise<HeroContent> {
    const current = await this.getHero();
    const updated = { ...current, ...data };
    this.writeJson('hero.json', updated);
    return updated;
  }

  async getStats(): Promise<StatItem[]> {
    return this.readJson<StatItem[]>('stats.json', []);
  }

  async saveStats(stats: StatItem[]): Promise<StatItem[]> {
    this.writeJson('stats.json', stats);
    return stats;
  }

  async getSolutions(): Promise<SolutionItem[]> {
    return this.readJson<SolutionItem[]>('solutions.json', []);
  }

  async getSolutionBySlug(slug: string): Promise<SolutionItem | null> {
    const list = await this.getSolutions();
    return list.find((s) => s.slug === slug) || null;
  }

  async saveSolution(item: SolutionItem): Promise<SolutionItem> {
    const list = await this.getSolutions();
    if (!item.id) item.id = uuidv4();
    const idx = list.findIndex((s) => s.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    this.writeJson('solutions.json', list);
    return item;
  }

  async deleteSolution(id: string): Promise<boolean> {
    const list = await this.getSolutions();
    const filtered = list.filter((s) => s.id !== id);
    this.writeJson('solutions.json', filtered);
    return true;
  }

  async getIndustries(): Promise<IndustryItem[]> {
    return this.readJson<IndustryItem[]>('industries.json', []);
  }

  async saveIndustry(item: IndustryItem): Promise<IndustryItem> {
    const list = await this.getIndustries();
    if (!item.id) item.id = uuidv4();
    const idx = list.findIndex((i) => i.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.writeJson('industries.json', list);
    return item;
  }

  async deleteIndustry(id: string): Promise<boolean> {
    const list = await this.getIndustries();
    this.writeJson('industries.json', list.filter((i) => i.id !== id));
    return true;
  }

  async getProjects(): Promise<ProjectItem[]> {
    return this.readJson<ProjectItem[]>('projects.json', []);
  }

  async saveProject(item: ProjectItem): Promise<ProjectItem> {
    const list = await this.getProjects();
    if (!item.id) item.id = uuidv4();
    const idx = list.findIndex((p) => p.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.writeJson('projects.json', list);
    return item;
  }

  async deleteProject(id: string): Promise<boolean> {
    const list = await this.getProjects();
    this.writeJson('projects.json', list.filter((p) => p.id !== id));
    return true;
  }

  async getTestimonials(): Promise<TestimonialItem[]> {
    return this.readJson<TestimonialItem[]>('testimonials.json', []);
  }

  async saveTestimonial(item: TestimonialItem): Promise<TestimonialItem> {
    const list = await this.getTestimonials();
    if (!item.id) item.id = uuidv4();
    const idx = list.findIndex((t) => t.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.writeJson('testimonials.json', list);
    return item;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const list = await this.getTestimonials();
    this.writeJson('testimonials.json', list.filter((t) => t.id !== id));
    return true;
  }

  async getClientLogos(): Promise<ClientLogoItem[]> {
    return this.readJson<ClientLogoItem[]>('client_logos.json', []);
  }

  async saveClientLogo(item: ClientLogoItem): Promise<ClientLogoItem> {
    const list = await this.getClientLogos();
    if (!item.id) item.id = uuidv4();
    const idx = list.findIndex((c) => c.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.writeJson('client_logos.json', list);
    return item;
  }

  async deleteClientLogo(id: string): Promise<boolean> {
    const list = await this.getClientLogos();
    this.writeJson('client_logos.json', list.filter((c) => c.id !== id));
    return true;
  }

  async getAbout(): Promise<AboutContent> {
    return this.readJson<AboutContent>('about.json', {
      id: 'about-1',
      company_story: 'Antrixx Technology was established by veteran thermal and utility automation engineers dedicated to optimizing industrial energy efficiency across India.',
      mission: 'To transform industrial utility operations through smart automation and energy loss diagnostics.',
      vision: 'To be South Asia’s most trusted thermal optimization partner.',
      values: ['Industrial Reliability', 'Data-Backed Integrity', 'Pan-India SLA Agility'],
      capabilities: ['Boiler House Automation', 'Remote Telemetry', 'Pollution Control', 'Steam Engineering'],
    });
  }

  async updateAbout(data: Partial<AboutContent>): Promise<AboutContent> {
    const current = await this.getAbout();
    const updated = { ...current, ...data };
    this.writeJson('about.json', updated);
    return updated;
  }

  async getTeam(): Promise<TeamMember[]> {
    return this.readJson<TeamMember[]>('team.json', []);
  }

  async saveTeamMember(item: TeamMember): Promise<TeamMember> {
    const list = await this.getTeam();
    if (!item.id) item.id = uuidv4();
    const idx = list.findIndex((t) => t.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.writeJson('team.json', list);
    return item;
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    const list = await this.getTeam();
    this.writeJson('team.json', list.filter((t) => t.id !== id));
    return true;
  }

  async getResources(): Promise<ResourcePost[]> {
    return this.readJson<ResourcePost[]>('resources.json', []);
  }

  async getResourceBySlug(slug: string): Promise<ResourcePost | null> {
    const list = await this.getResources();
    return list.find((r) => r.slug === slug) || null;
  }

  async saveResource(item: ResourcePost): Promise<ResourcePost> {
    const list = await this.getResources();
    if (!item.id) item.id = uuidv4();
    const idx = list.findIndex((r) => r.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.writeJson('resources.json', list);
    return item;
  }

  async deleteResource(id: string): Promise<boolean> {
    const list = await this.getResources();
    this.writeJson('resources.json', list.filter((r) => r.id !== id));
    return true;
  }

  async getJobOpenings(): Promise<JobOpening[]> {
    return this.readJson<JobOpening[]>('job_openings.json', []);
  }

  async saveJobOpening(item: JobOpening): Promise<JobOpening> {
    const list = await this.getJobOpenings();
    if (!item.id) item.id = uuidv4();
    const idx = list.findIndex((j) => j.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.writeJson('job_openings.json', list);
    return item;
  }

  async deleteJobOpening(id: string): Promise<boolean> {
    const list = await this.getJobOpenings();
    this.writeJson('job_openings.json', list.filter((j) => j.id !== id));
    return true;
  }

  async getJobApplications(): Promise<JobApplication[]> {
    return this.readJson<JobApplication[]>('job_applications.json', []);
  }

  async addJobApplication(app: Omit<JobApplication, 'id' | 'created_at'>): Promise<JobApplication> {
    const list = await this.getJobApplications();
    const newApp: JobApplication = {
      ...app,
      id: uuidv4(),
      created_at: new Date().toISOString(),
    };
    list.unshift(newApp);
    this.writeJson('job_applications.json', list);
    return newApp;
  }

  async deleteJobApplication(id: string): Promise<boolean> {
    const list = await this.getJobApplications();
    this.writeJson('job_applications.json', list.filter((j) => j.id !== id));
    return true;
  }

  async getFaqs(): Promise<FaqItem[]> {
    return this.readJson<FaqItem[]>('faqs.json', []);
  }

  async saveFaq(item: FaqItem): Promise<FaqItem> {
    const list = await this.getFaqs();
    if (!item.id) item.id = uuidv4();
    const idx = list.findIndex((f) => f.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
    this.writeJson('faqs.json', list);
    return item;
  }

  async deleteFaq(id: string): Promise<boolean> {
    const list = await this.getFaqs();
    this.writeJson('faqs.json', list.filter((f) => f.id !== id));
    return true;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return this.readJson<ContactSubmission[]>('contact_submissions.json', []);
  }

  async addContactSubmission(sub: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<ContactSubmission> {
    const list = await this.getContactSubmissions();
    const newSub: ContactSubmission = {
      ...sub,
      id: uuidv4(),
      created_at: new Date().toISOString(),
    };
    list.unshift(newSub);
    this.writeJson('contact_submissions.json', list);
    return newSub;
  }

  async deleteContactSubmission(id: string): Promise<boolean> {
    const list = await this.getContactSubmissions();
    this.writeJson('contact_submissions.json', list.filter((c) => c.id !== id));
    return true;
  }

  async getSiteSettings(): Promise<SiteSettings> {
    return this.readJson<SiteSettings>('site_settings.json', {
      id: 'settings-1',
      phone_primary: '+91 9748636108',
      phone_secondary: '+91 9477179885',
      email: 'antrixxtechnology@gmail.com',
      address: 'Kolkata, West Bengal, India',
      business_hours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
      linkedin_url: 'https://linkedin.com/company/antrixx-technology',
      brochure_pdf_url: '/api/resources/downloads/profile-pdf',
    });
  }

  async updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const current = await this.getSiteSettings();
    const updated = { ...current, ...data };
    this.writeJson('site_settings.json', updated);
    return updated;
  }
}
