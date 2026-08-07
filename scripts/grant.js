import postgres from 'postgres';
const sql = postgres('postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres');

async function grant() {
    await sql`GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;`;
    await sql`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;`;
    console.log('Permissions granted.');
    await sql.end();
}
grant();
