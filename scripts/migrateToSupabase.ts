import fs from 'fs';
import path from 'path';
import postgres from 'postgres';
import { getRepository } from '../src/repository/index.js';

const sqlFile = path.resolve(process.cwd(), 'supabase/migrations/20260806000000_init_schema.sql');
const connectionString = 'postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function migrate() {
  console.log('[Migrate] Connecting to Supabase Postgres...');
  const sql = postgres(connectionString);
  
  try {
    // const schema = fs.readFileSync(sqlFile, 'utf-8');
    // console.log('[Migrate] Running init_schema.sql...');
    // await sql.unsafe(schema);
    // console.log('[Migrate] Schema initialized successfully.');
    
    // Now we must copy all data from LocalJsonRepository to SupabaseRepository
    // Note: getRepository() will return SupabaseRepository because SUPABASE_URL is set in .env
    const repo = getRepository();
    
    // We will directly use the data JSON files to push to Supabase to bypass any complexities
    const dataDir = path.resolve(process.cwd(), 'data');
    
    const readJson = (file: string) => {
        try { return JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8')); } 
        catch { return null; }
    };

    console.log('[Migrate] Pushing Hero data...');
    const hero = readJson('hero.json');
    if (hero) await repo.updateHero(hero); // will upsert

    console.log('[Migrate] Pushing Stats...');
    const stats = readJson('stats.json');
    if (stats) await (repo as any).saveStats(stats);

    console.log('[Migrate] Pushing Solutions...');
    const solutions = readJson('solutions.json');
    if (solutions) {
        for (const sol of solutions) await repo.saveSolution(sol);
    }
    
    console.log('[Migrate] Pushing Industries...');
    const industries = readJson('industries.json');
    if (industries) {
        for (const ind of industries) await repo.saveIndustry(ind);
    }
    
    console.log('[Migrate] Pushing Projects...');
    const projects = readJson('projects.json');
    if (projects) {
        for (const proj of projects) await repo.saveProject(proj);
    }
    
    console.log('[Migrate] Pushing Client Logos...');
    const clientLogos = readJson('client_logos.json');
    if (clientLogos) {
        for (const logo of clientLogos) await (repo as any).saveClientLogo(logo);
    }

    console.log('[Migrate] Migration to Supabase Complete! ✅');
  } catch (err) {
    console.error('[Migrate] Failed:', err);
  } finally {
    await sql.end();
  }
}

migrate();
