import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const jsonPath = path.resolve(process.cwd(), 'data', 'solutions.json');
  const solutions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  const slugMap = {
    'utility-remote-monitoring': 'utility-remote-monitoring',
    'boiler-automation': 'pollution-control-equipment',
    'ash-handling-system': 'ash-handling-systems',
    'fuel-handling-system': 'fuel-handling-systems',
    'boiler-bag-filter-water-treatment-spares': 'spare-parts-boiler-bag-filter',
    'steam-energy-loss-diagnosis': 'steam-energy-loss-diagnosis',
    'project-consultation-management': 'project-consultation-management',
    'heat-pump-chilling-bop-management': 'heat-pump-chilling-system-bop',
  };

  const { data: dbSolutions } = await supabase.from('solutions').select('id, slug, title');
  if (!dbSolutions) return;

  for (const dbSol of dbSolutions) {
    if (dbSol.slug === 'boiler-automation-steam-fuel-tracker') continue; // already populated

    const jsonSol = solutions.find(
      (s) =>
        s.slug === dbSol.slug ||
        s.slug === slugMap[dbSol.slug] ||
        s.title.toLowerCase().includes(dbSol.title.toLowerCase().substring(0, 10))
    );

    if (jsonSol && jsonSol.sub_products && jsonSol.sub_products.length > 0) {
      console.log(`Populating sub_products for: ${dbSol.slug} (${jsonSol.sub_products.length} models)...`);
      await supabase
        .from('solutions')
        .update({
          sub_products: jsonSol.sub_products,
          scope_cards: jsonSol.scope_cards || [],
          badge_highlights: jsonSol.badge_highlights || [],
          products_and_services: jsonSol.products_and_services || [],
        })
        .eq('id', dbSol.id);
    }
  }

  console.log('Sub-products populated successfully!');
}

run();
