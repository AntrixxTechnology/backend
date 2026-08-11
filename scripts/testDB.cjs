const postgres = require('postgres');
const sql = postgres('postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres');
sql`SELECT id, logo_url FROM client_logos`.then(res => {
  console.log('Client Logos:', res);
  return sql`SELECT * FROM hero LIMIT 1`;
}).then(res => {
  console.log('Hero:', res);
  sql.end();
}).catch(console.error);
