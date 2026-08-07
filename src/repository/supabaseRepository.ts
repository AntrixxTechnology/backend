import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

export class SupabaseRepository implements ContentRepository {
  private client: SupabaseClient;

  constructor(supabaseUrl: string, serviceRoleKey: string) {
    this.client = createClient(supabaseUrl, serviceRoleKey);
  }

  async getHero(): Promise<HeroContent> {
    const { data } = await this.client.from('hero').select('*').limit(1).single();
    return data;
  }

  async updateHero(data: Partial<HeroContent>): Promise<HeroContent> {
    const { data: updated } = await this.client
      .from('hero')
      .update(data)
      .eq('id', data.id)
      .select()
      .single();
    return updated;
  }

  async getStats(): Promise<StatItem[]> {
    const { data } = await this.client.from('stats').select('*').order('sort_order');
    return data || [];
  }

  async saveStats(stats: StatItem[]): Promise<StatItem[]> {
    const { data } = await this.client.from('stats').upsert(stats).select();
    return data || [];
  }

  async getSolutions(): Promise<SolutionItem[]> {
    const { data } = await this.client.from('solutions').select('*').order('sort_order');
    return data || [];
  }

  async getSolutionBySlug(slug: string): Promise<SolutionItem | null> {
    const { data } = await this.client.from('solutions').select('*').eq('slug', slug).single();
    return data;
  }

  async saveSolution(item: SolutionItem): Promise<SolutionItem> {
    const { data } = await this.client.from('solutions').upsert(item).select().single();
    return data;
  }

  async deleteSolution(id: string): Promise<boolean> {
    const { error } = await this.client.from('solutions').delete().eq('id', id);
    return !error;
  }

  async getIndustries(): Promise<IndustryItem[]> {
    const { data } = await this.client.from('industries').select('*').order('sort_order');
    return data || [];
  }

  async saveIndustry(item: IndustryItem): Promise<IndustryItem> {
    const { data } = await this.client.from('industries').upsert(item).select().single();
    return data;
  }

  async deleteIndustry(id: string): Promise<boolean> {
    const { error } = await this.client.from('industries').delete().eq('id', id);
    return !error;
  }

  async getProjects(): Promise<ProjectItem[]> {
    const { data } = await this.client.from('projects').select('*').order('sort_order');
    return data || [];
  }

  async saveProject(item: ProjectItem): Promise<ProjectItem> {
    const { data } = await this.client.from('projects').upsert(item).select().single();
    return data;
  }

  async deleteProject(id: string): Promise<boolean> {
    const { error } = await this.client.from('projects').delete().eq('id', id);
    return !error;
  }

  async getTestimonials(): Promise<TestimonialItem[]> {
    const { data } = await this.client.from('testimonials').select('*').order('sort_order');
    return data || [];
  }

  async saveTestimonial(item: TestimonialItem): Promise<TestimonialItem> {
    const { data } = await this.client.from('testimonials').upsert(item).select().single();
    return data;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    const { error } = await this.client.from('testimonials').delete().eq('id', id);
    return !error;
  }

  async getClientLogos(): Promise<ClientLogoItem[]> {
    const { data } = await this.client.from('client_logos').select('*').order('sort_order');
    return data || [];
  }

  async saveClientLogo(item: ClientLogoItem): Promise<ClientLogoItem> {
    const { data } = await this.client.from('client_logos').upsert(item).select().single();
    return data;
  }

  async deleteClientLogo(id: string): Promise<boolean> {
    const { error } = await this.client.from('client_logos').delete().eq('id', id);
    return !error;
  }

  async getAbout(): Promise<AboutContent> {
    const { data } = await this.client.from('about').select('*').limit(1).single();
    return data;
  }

  async updateAbout(data: Partial<AboutContent>): Promise<AboutContent> {
    const { data: updated } = await this.client
      .from('about')
      .update(data)
      .eq('id', data.id)
      .select()
      .single();
    return updated;
  }

  async getTeam(): Promise<TeamMember[]> {
    const { data } = await this.client.from('team').select('*').order('sort_order');
    return data || [];
  }

  async saveTeamMember(item: TeamMember): Promise<TeamMember> {
    const { data } = await this.client.from('team').upsert(item).select().single();
    return data;
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    const { error } = await this.client.from('team').delete().eq('id', id);
    return !error;
  }

  async getResources(): Promise<ResourcePost[]> {
    const { data } = await this.client.from('resources').select('*').order('sort_order');
    return data || [];
  }

  async getResourceBySlug(slug: string): Promise<ResourcePost | null> {
    const { data } = await this.client.from('resources').select('*').eq('slug', slug).single();
    return data;
  }

  async saveResource(item: ResourcePost): Promise<ResourcePost> {
    const { data } = await this.client.from('resources').upsert(item).select().single();
    return data;
  }

  async deleteResource(id: string): Promise<boolean> {
    const { error } = await this.client.from('resources').delete().eq('id', id);
    return !error;
  }

  async getJobOpenings(): Promise<JobOpening[]> {
    const { data } = await this.client.from('job_openings').select('*').order('sort_order');
    return data || [];
  }

  async saveJobOpening(item: JobOpening): Promise<JobOpening> {
    const { data } = await this.client.from('job_openings').upsert(item).select().single();
    return data;
  }

  async deleteJobOpening(id: string): Promise<boolean> {
    const { error } = await this.client.from('job_openings').delete().eq('id', id);
    return !error;
  }

  async getJobApplications(): Promise<JobApplication[]> {
    const { data } = await this.client.from('job_applications').select('*').order('created_at', { ascending: false });
    return data || [];
  }

  async addJobApplication(app: Omit<JobApplication, 'id' | 'created_at'>): Promise<JobApplication> {
    const { data } = await this.client.from('job_applications').insert(app).select().single();
    return data;
  }

  async deleteJobApplication(id: string): Promise<boolean> {
    const { error } = await this.client.from('job_applications').delete().eq('id', id);
    return !error;
  }

  async getFaqs(): Promise<FaqItem[]> {
    const { data } = await this.client.from('faqs').select('*').order('sort_order');
    return data || [];
  }

  async saveFaq(item: FaqItem): Promise<FaqItem> {
    const { data } = await this.client.from('faqs').upsert(item).select().single();
    return data;
  }

  async deleteFaq(id: string): Promise<boolean> {
    const { error } = await this.client.from('faqs').delete().eq('id', id);
    return !error;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    const { data } = await this.client.from('contact_submissions').select('*').order('created_at', { ascending: false });
    return data || [];
  }

  async addContactSubmission(sub: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<ContactSubmission> {
    const { data } = await this.client.from('contact_submissions').insert(sub).select().single();
    return data;
  }

  async deleteContactSubmission(id: string): Promise<boolean> {
    const { error } = await this.client.from('contact_submissions').delete().eq('id', id);
    return !error;
  }

  async getSiteSettings(): Promise<SiteSettings> {
    const { data } = await this.client.from('site_settings').select('*').limit(1).single();
    return data;
  }

  async updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
    const { data: updated } = await this.client
      .from('site_settings')
      .update(data)
      .eq('id', data.id)
      .select()
      .single();
    return updated;
  }
}
