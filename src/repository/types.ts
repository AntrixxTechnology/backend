export interface HeroContent {
  id: string;
  badge: string;
  headline: string;
  accent_text: string;
  description: string;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  background_image_url?: string;
  scada_plant_efficiency: number;
  scada_steam_flow: number;
  scada_fuel_consumption: number;
  scada_energy_saved_mwh: number;
  is_published: boolean;
}

export interface StatItem {
  id: string;
  label: string;
  value_number: number;
  suffix: string;
  description?: string;
  icon_name: string;
  sort_order: number;
  is_published: boolean;
}

export interface SolutionItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  full_description: string;
  icon_name: string;
  hero_image_url?: string;
  features: string[];
  deliverables: string[];
  technical_specs?: Record<string, string>;
  sort_order: number;
  is_published: boolean;
}

export interface IndustryItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon_name: string;
  image_url?: string;
  key_benefits: string[];
  sort_order: number;
  is_published: boolean;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  industry: string;
  location: string;
  challenge: string;
  solution: string;
  results: string[];
  image_url?: string;
  sort_order: number;
  is_published: boolean;
}

export interface TestimonialItem {
  id: string;
  author_name: string;
  author_role: string;
  company_name: string;
  quote: string;
  rating: number;
  avatar_url?: string;
  sort_order: number;
  is_published: boolean;
}

export interface ClientLogoItem {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string;
  sort_order: number;
  is_published: boolean;
}

export interface AboutContent {
  id: string;
  company_story: string;
  mission: string;
  vision: string;
  values: string[];
  capabilities: string[];
  hero_image_url?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  image_url?: string;
  linkedin_url?: string;
  sort_order: number;
  is_published: boolean;
}

export interface ResourcePost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  cover_image_url?: string;
  download_file_url?: string;
  published_date: string;
  sort_order: number;
  is_published: boolean;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  sort_order: number;
  is_published: boolean;
}

export interface JobApplication {
  id: string;
  applicant_name: string;
  email: string;
  phone: string;
  role_title: string;
  notes?: string;
  resume_file_url?: string;
  status: 'unread' | 'reviewed' | 'contacted';
  created_at: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_published: boolean;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  company_name?: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
}

export interface SiteSettings {
  id: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  address: string;
  business_hours: string;
  linkedin_url: string;
  brochure_pdf_url?: string;
}

export interface ContentRepository {
  getHero(): Promise<HeroContent>;
  updateHero(data: Partial<HeroContent>): Promise<HeroContent>;

  getStats(): Promise<StatItem[]>;
  saveStats(stats: StatItem[]): Promise<StatItem[]>;

  getSolutions(): Promise<SolutionItem[]>;
  getSolutionBySlug(slug: string): Promise<SolutionItem | null>;
  saveSolution(item: SolutionItem): Promise<SolutionItem>;
  deleteSolution(id: string): Promise<boolean>;

  getIndustries(): Promise<IndustryItem[]>;
  saveIndustry(item: IndustryItem): Promise<IndustryItem>;
  deleteIndustry(id: string): Promise<boolean>;

  getProjects(): Promise<ProjectItem[]>;
  saveProject(item: ProjectItem): Promise<ProjectItem>;
  deleteProject(id: string): Promise<boolean>;

  getTestimonials(): Promise<TestimonialItem[]>;
  saveTestimonial(item: TestimonialItem): Promise<TestimonialItem>;
  deleteTestimonial(id: string): Promise<boolean>;

  getClientLogos(): Promise<ClientLogoItem[]>;
  saveClientLogo(item: ClientLogoItem): Promise<ClientLogoItem>;
  deleteClientLogo(id: string): Promise<boolean>;

  getAbout(): Promise<AboutContent>;
  updateAbout(data: Partial<AboutContent>): Promise<AboutContent>;

  getTeam(): Promise<TeamMember[]>;
  saveTeamMember(item: TeamMember): Promise<TeamMember>;
  deleteTeamMember(id: string): Promise<boolean>;

  getResources(): Promise<ResourcePost[]>;
  getResourceBySlug(slug: string): Promise<ResourcePost | null>;
  saveResource(item: ResourcePost): Promise<ResourcePost>;
  deleteResource(id: string): Promise<boolean>;

  getJobOpenings(): Promise<JobOpening[]>;
  saveJobOpening(item: JobOpening): Promise<JobOpening>;
  deleteJobOpening(id: string): Promise<boolean>;

  getJobApplications(): Promise<JobApplication[]>;
  addJobApplication(app: Omit<JobApplication, 'id' | 'created_at'>): Promise<JobApplication>;
  deleteJobApplication(id: string): Promise<boolean>;

  getFaqs(): Promise<FaqItem[]>;
  saveFaq(item: FaqItem): Promise<FaqItem>;
  deleteFaq(id: string): Promise<boolean>;

  getContactSubmissions(): Promise<ContactSubmission[]>;
  addContactSubmission(sub: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<ContactSubmission>;
  deleteContactSubmission(id: string): Promise<boolean>;

  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings>;
}
