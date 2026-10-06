import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function sync() {
  console.log('Syncing solutions with sub_products and scope_cards to Supabase...');
  const jsonPath = path.resolve(process.cwd(), 'data', 'solutions.json');
  const solutions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  for (const sol of solutions) {
    // If sol is steam-fuel-tracker or steam-engineering-automation, we merged them earlier
    if (sol.slug === 'steam-engineering-automation') continue;

    let targetSlug = sol.slug;
    if (sol.slug === 'steam-fuel-tracker-system' || sol.slug === 'steam-fuel-tracker') {
      targetSlug = 'boiler-automation-steam-fuel-tracker';
    }

    // Find existing solution in Supabase by slug or title match
    const { data: existing } = await supabase
      .from('solutions')
      .select('id, slug, title')
      .or(`slug.eq.${targetSlug},slug.eq.${sol.slug},slug.eq.utility-remote-monitoring,slug.eq.boiler-automation,slug.eq.ash-handling-system,slug.eq.fuel-handling-system,slug.eq.boiler-bag-filter-water-treatment-spares,slug.eq.steam-energy-loss-diagnosis,slug.eq.project-consultation-management,slug.eq.heat-pump-chilling-bop-management`)
      .limit(1)
      .maybeSingle();

    if (existing) {
      console.log(`Updating ${existing.slug} (${existing.title})...`);
      const { error } = await supabase
        .from('solutions')
        .update({
          sub_products: sol.sub_products || [],
          scope_cards: sol.scope_cards || [],
          badge_highlights: sol.badge_highlights || [],
          products_and_services: sol.products_and_services || [],
        })
        .eq('id', existing.id);

      if (error) console.error(`Error updating ${existing.slug}:`, error.message);
      else console.log(`Updated sub_products for ${existing.slug} (${(sol.sub_products || []).length} models)`);
    }
  }

  console.log('Sync complete!');
}

sync();
