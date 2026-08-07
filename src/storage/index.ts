import dotenv from 'dotenv';
import { StorageProvider } from './types.js';
import { LocalDiskStorageProvider } from './localStorage.js';
import { SupabaseStorageProvider } from './supabaseStorage.js';

dotenv.config();

let storageInstance: StorageProvider;

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (supabaseUrl && serviceRoleKey && supabaseUrl.startsWith('https://')) {
  console.log('[Storage] Initializing SupabaseStorageProvider...');
  storageInstance = new SupabaseStorageProvider(supabaseUrl, serviceRoleKey);
} else {
  console.log('[Storage] Supabase credentials not found. Initializing LocalDiskStorageProvider...');
  storageInstance = new LocalDiskStorageProvider();
}

export function getStorageProvider(): StorageProvider {
  return storageInstance;
}

export * from './types.js';
