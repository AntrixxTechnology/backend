import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

const connectionString = 'postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function fixImages() {
  console.log('[FixImages] Connecting to DB...');
  const sql = postgres(connectionString);
  
  try {
    const dataDir = path.resolve(process.cwd(), 'data');
    
    // 1. Fix Client Logos
    const clientLogosLocal = JSON.parse(fs.readFileSync(path.join(dataDir, 'client_logos.json'), 'utf-8'));
    console.log(`[FixImages] Loaded ${clientLogosLocal.length} client logos from local JSON.`);
    
    const dbLogos = await sql`SELECT * FROM client_logos`;
    console.log(`[FixImages] Loaded ${dbLogos.length} client logos from DB.`);
    
    for (const dbLogo of dbLogos) {
      const localLogo = clientLogosLocal.find((l: any) => l.name === dbLogo.name);
      if (localLogo && localLogo.logo_url) {
        await sql`UPDATE client_logos SET logo_url = ${localLogo.logo_url} WHERE id = ${dbLogo.id}`;
        console.log(`[FixImages] Updated logo_url for ${dbLogo.name}`);
      }
    }
    
    // 2. Fix Hero Thumbnails
    const heroLocal = JSON.parse(fs.readFileSync(path.join(dataDir, 'hero.json'), 'utf-8'));
    const dbHero = await sql`SELECT id FROM hero LIMIT 1`;
    if (dbHero.length > 0) {
      const heroId = dbHero[0].id;
      await sql`
        UPDATE hero 
        SET hero_image_1 = ${heroLocal.hero_image_1},
            hero_image_2 = ${heroLocal.hero_image_2},
            hero_image_3 = ${heroLocal.hero_image_3}
        WHERE id = ${heroId}
      `;
      console.log(`[FixImages] Updated hero images for hero record ${heroId}`);
    }
    
    console.log('[FixImages] Done! ✅');
  } catch (err) {
    console.error('[FixImages] Error:', err);
  } finally {
    await sql.end();
  }
}

fixImages();
