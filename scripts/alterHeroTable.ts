import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = 'postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function alterTable() {
  console.log('[Migrate] Connecting to Supabase Postgres...');
  const sql = postgres(connectionString);
  
  try {
    console.log('[Migrate] Altering hero table...');
    await sql`ALTER TABLE hero ADD COLUMN IF NOT EXISTS hero_image_1 TEXT;`;
    await sql`ALTER TABLE hero ADD COLUMN IF NOT EXISTS hero_image_2 TEXT;`;
    await sql`ALTER TABLE hero ADD COLUMN IF NOT EXISTS hero_image_3 TEXT;`;
    console.log('[Migrate] hero table altered successfully.');
  } catch (err) {
    console.error('[Migrate] Failed:', err);
  } finally {
    await sql.end();
  }
}

alterTable();
