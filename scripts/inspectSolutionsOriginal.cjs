const postgres = require('postgres');
const sql = postgres('postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres');

async function run() {
  const rows = await sql`SELECT id, slug, title, hero_image_url, technical_specs, sub_products FROM solutions ORDER BY sort_order ASC`;
  for (const r of rows) {
    console.log('=== ' + r.slug + ' ===');
    console.log('Title: ' + r.title);
    console.log('Hero Image: ' + r.hero_image_url);
    if (r.sub_products && r.sub_products.length > 0) {
      console.log('SubProducts count: ' + r.sub_products.length);
      r.sub_products.forEach((p, i) => console.log(`  [${i}] ${p.name} -> ${p.image_url}`));
    } else {
      console.log('SubProducts: NONE');
    }
  }
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
