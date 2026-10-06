import postgres from 'postgres';

const connectionString = 'postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function run() {
  const sql = postgres(connectionString);
  const rows = await sql`SELECT id, slug, title, sort_order FROM solutions ORDER BY sort_order`;
  console.log('TOTAL SOLUTIONS:', rows.length);
  rows.forEach((r, i) => console.log(`${i + 1}. [${r.sort_order}] ${r.slug} - ${r.title}`));
  await sql.end();
}

run();
