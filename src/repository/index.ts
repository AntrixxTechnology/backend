import dotenv from 'dotenv';
import { ContentRepository } from './types.js';
import { LocalJsonRepository } from './jsonRepository.js';
import { SupabaseRepository } from './supabaseRepository.js';

dotenv.config();

let repositoryInstance: ContentRepository;

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && serviceRoleKey && supabaseUrl.startsWith('https://')) {
  console.log('[Repository] Initializing SupabaseRepository with active database...');
  repositoryInstance = new SupabaseRepository(supabaseUrl, serviceRoleKey);
} else {
  console.log('[Repository] Supabase credentials not found. Initializing LocalJsonRepository...');
  repositoryInstance = new LocalJsonRepository();
}

export function getRepository(): ContentRepository {
  return repositoryInstance;
}

export * from './types.js';
