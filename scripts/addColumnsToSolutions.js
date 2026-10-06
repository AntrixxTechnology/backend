import postgres from 'postgres';

const connectionString = 'postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function run() {
  const sql = postgres(connectionString);
  try {
    console.log('Adding columns to solutions table...');
    await sql`
      ALTER TABLE solutions 
      ADD COLUMN IF NOT EXISTS sub_products JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS scope_cards JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS badge_highlights JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS products_and_services JSONB DEFAULT '[]'::jsonb;
    `;
    console.log('Columns added successfully!');
  } catch (err) {
    console.error('Error adding columns:', err);
  } finally {
    await sql.end();
  }
}

run();
