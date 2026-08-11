import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

const sqlFile = path.resolve(process.cwd(), 'supabase/migrations/20260811000000_add_blogs_table.sql');
const connectionString = 'postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function migrate() {
  console.log('[Migrate] Connecting to DB...');
  const sql = postgres(connectionString);
  try {
    const schema = fs.readFileSync(sqlFile, 'utf-8');
    await sql.unsafe(schema);
    console.log('[Migrate] Successfully added blogs table.');
  } catch (err) {
    console.error('[Migrate] Error:', err);
  } finally {
    await sql.end();
  }
}

migrate();
