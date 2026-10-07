const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const postgres = require('postgres');

const SUPABASE_URL = 'https://cjaeubdycgnwgfkbddvb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYWV1YmR5Y2dud2dma2JkZHZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA4Nzk5NSwiZXhwIjoyMTAxNjYzOTk1fQ.ZX01N5InoplkLAxCOMQcZpVnOz__AT3Ndf-FQ0wEnmY';
const DB_URL = 'postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const sql = postgres(DB_URL);

async function uploadFile(localPath, remoteName) {
  const fileBuffer = fs.readFileSync(localPath);
  const { data, error } = await supabase.storage
    .from('general')
    .upload(remoteName, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    console.error('Error uploading ' + remoteName + ':', error);
    throw error;
  }

  const { data: publicData } = supabase.storage.from('general').getPublicUrl(remoteName);
  console.log('Uploaded ' + remoteName + ' -> ' + publicData.publicUrl);
  return publicData.publicUrl;
}

async function run() {
  const artifactDir = 'C:\\Users\\Tusha\\.gemini\\antigravity-ide\\brain\\0edee1e9-fbf1-4824-95aa-fdd6a7684cc1';
  
  const cyclonePath = path.join(artifactDir, 'cyclone_dust_collector_1791358068851.jpg');
  const baghousePath = path.join(artifactDir, 'bag_filter_baghouse_1791358088887.jpg');
  const boilerPath = path.join(artifactDir, 'boiler_thermic_heater_1791358127772.jpg');

  console.log('1. Uploading images to Supabase storage general bucket...');
  const cycloneUrl = await uploadFile(cyclonePath, 'cyclone_dust_collector_industrial.jpg');
  const baghouseUrl = await uploadFile(baghousePath, 'baghouse_bag_filter_industrial.jpg');
  const boilerUrl = await uploadFile(boilerPath, 'boiler_retrofit_thermic_heater_industrial.jpg');

  console.log('2. Cleaning up utility-remote-monitoring (Retrofitting) from database...');
  // Wipe out the 10 fake "New Equipment Model" items!
  await sql`
    UPDATE solutions
    SET sub_products = NULL,
        hero_image_url = ${boilerUrl}
    WHERE slug = 'utility-remote-monitoring'
  `;
  console.log('Retrofitting cleaned. sub_products set to NULL (single product), hero image updated.');

  console.log('3. Updating Pollution Control Equipment models with new realistic images...');
  const pollutionSubProducts = [
    {
      id: 'sub-pce-1',
      name: 'Cyclone Dust Collector',
      image_url: cycloneUrl,
      description: 'Centrifugal particulate separator designed for heavy dust loads before secondary filtration.',
      technical_specs: {
        'Application': 'Cement, Power, Steel, Food, Chemical, Mining & Processing',
        'Gas Flow Capacity': '500 – 500,000 CMH',
        'Collection Efficiency': '85% – 95% (for particulate size > 5 microns)',
        'Inlet Dust Load': 'Up to 50 g/Nm³',
        'Operating Temperature': 'Up to 400 °C',
        'Material of Construction': 'Mild Steel / SS / Special Alloys',
        'Design Type': 'Standard / High Efficiency Centrifugal',
        'Pressure Drop': '800 – 1500 Pa',
        'Customization': 'Available as per process duty & duct layout'
      }
    },
    {
      id: 'sub-pce-2',
      name: 'Pulse-Jet Bag Filter (Baghouse)',
      image_url: baghouseUrl,
      description: 'High-efficiency fabric filter system capturing fine sub-micron dust particles with pulse jet cleaning.',
      technical_specs: {
        'Application': 'Boiler, Cement, Steel, Food, Chemical & Process Industries',
        'Gas Flow Capacity': '1,000 – 300,000 CMH',
        'Collection Efficiency': 'Up to 99%+ particulate removal compliance',
        'Filter Media': 'Polyester / PPS / PTFE / Nomex / Fiber Glass',
        'Cleaning System': 'Online / Offline Pulse Jet Compressed Air',
        'Operating Temperature': 'Application dependent (up to 260 °C with PTFE/Nomex)',
        'Construction': 'Heavy-duty Mild Steel / SS316 with stiffeners',
        'Pressure Drop': 'Typically 800 – 1800 Pa',
        'Customization': 'Filter bag length, hopper configuration & rotary valve'
      }
    },
    {
      id: 'sub-pce-3',
      name: 'Spray Type Wet Scrubber',
      image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=85',
      description: 'Liquid contact scrubbing for corrosive gases, fly ash, acid fumes and soluble pollutants.',
      technical_specs: {
        'Application': 'Boilers, Chemical, Metallurgical & Process Industries',
        'Gas Flow Capacity': 'Application-specific custom sizing',
        'Removal Mechanism': 'Spray contact, impaction and gas absorption',
        'Pollutant Control': 'Particulate dust and selected acid / reactive gases',
        'Operating Temperature': 'Designed according to inlet gas condition',
        'Construction': 'Mild Steel / FRP / Polypropylene / SS Lined',
        'Liquid System': 'Non-clogging spray nozzles, circulation pump & piping',
        'Pressure Drop': 'Application dependent (typically 600 – 1200 Pa)',
        'Customization': 'Multi-stage spray and mist eliminator integration'
      }
    }
  ];

  await sql`
    UPDATE solutions
    SET sub_products = ${JSON.stringify(pollutionSubProducts)}::jsonb,
        hero_image_url = ${cycloneUrl}
    WHERE slug = 'boiler-automation'
  `;
  console.log('Pollution Control Equipment updated with new industrial images.');

  console.log('4. Verification:');
  const rows = await sql`SELECT slug, title, hero_image_url, sub_products FROM solutions WHERE slug IN ('utility-remote-monitoring', 'boiler-automation')`;
  for (const r of rows) {
    console.log(`=== ${r.slug} ===`);
    console.log(`Hero: ${r.hero_image_url}`);
    console.log(`SubProducts: ${r.sub_products ? (Array.isArray(r.sub_products) ? r.sub_products.length + ' items' : typeof r.sub_products) : 'NULL'}`);
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
