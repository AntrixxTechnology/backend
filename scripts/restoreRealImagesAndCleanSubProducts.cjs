const postgres = require('postgres');
const sql = postgres('postgresql://postgres.cjaeubdycgnwgfkbddvb:antrixx2026@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres');

async function run() {
  console.log('Restoring real original images and clearing fake sub-products...');

  // 1. Pollution Control Equipment: Only one with legitimate 3 models provided by client in HTML
  const pollutionSubProducts = [
    {
      id: 'sub-pce-1',
      name: 'Cyclone Dust Collector',
      image_url: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1000&q=85',
      description: 'Centrifugal particulate separator for high dust load before final filtration.',
      technical_specs: {
        'Application': 'Cement, Power, Steel, Food, Chemical, Mining & more',
        'Gas Flow Capacity': '500 – 500,000 CMH',
        'Collection Efficiency': '85% – 95% (for particulate size > 5 microns)',
        'Inlet Dust Load': 'Up to 50 g/Nm³',
        'Operating Temperature': 'Up to 400 °C',
        'Material of Construction': 'Mild Steel / SS / Special Alloys',
        'Design Type': 'Standard / High Efficiency',
        'Pressure Drop': '800 – 1500 Pa',
        'Customization': 'Available as per process requirement'
      }
    },
    {
      id: 'sub-pce-2',
      name: 'Bag Filter (Baghouse)',
      image_url: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1000&q=85',
      description: 'High-efficiency fabric filter capturing sub-micron particulate emissions.',
      technical_specs: {
        'Application': 'Boiler, Cement, Steel, Food, Chemical & Process Industries',
        'Gas Flow Capacity': '1,000 – 300,000 CMH',
        'Collection Efficiency': 'Up to 99%+ with suitable design',
        'Filter Media': 'Polyester / PPS / PTFE / Nomex',
        'Cleaning System': 'Pulse Jet / Reverse Air',
        'Operating Temperature': 'Application dependent; high-temperature media available',
        'Construction': 'Mild Steel / SS / Special Alloys',
        'Pressure Drop': 'Typically 800 – 1800 Pa',
        'Customization': 'Available as per process requirement'
      }
    },
    {
      id: 'sub-pce-3',
      name: 'Spray Type Wet Scrubber',
      image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=85',
      description: 'Liquid contact scrubbing for corrosive gases, fly ash and soluble pollutants.',
      technical_specs: {
        'Application': 'Boilers, Chemical, Metallurgical & Process Industries',
        'Gas Flow Capacity': 'Application-specific',
        'Removal Mechanism': 'Spray contact, impaction and gas absorption',
        'Pollutant Control': 'Dust and selected soluble / reactive gases',
        'Operating Temperature': 'Designed according to inlet gas condition',
        'Construction': 'Mild Steel / FRP / SS / Lined Construction',
        'Liquid System': 'Spray nozzles, pump, piping and recirculation',
        'Pressure Drop': 'Application dependent',
        'Customization': 'Available according to process duty'
      }
    }
  ];

  await sql`
    UPDATE solutions
    SET sub_products = ${JSON.stringify(pollutionSubProducts)}::jsonb
    WHERE slug = 'boiler-automation'
  `;
  console.log('Updated Pollution Control Equipment with client HTML models.');

  // 2. Clear fake sub-products for single-product solutions so they do NOT force a fake 3-card carousel!
  const singleProductSlugs = [
    'utility-remote-monitoring',
    'ash-handling-system',
    'fuel-handling-system',
    'boiler-automation-steam-fuel-tracker',
    'boiler-bag-filter-water-treatment-spares',
    'steam-energy-loss-diagnosis',
    'project-consultation-management',
    'heat-pump-chilling-bop-management'
  ];

  await sql`
    UPDATE solutions
    SET sub_products = NULL
    WHERE slug = ANY(${singleProductSlugs})
  `;
  console.log('Cleared fake sub_products for all single-product solutions.');

  // 3. Ensure authentic original Supabase hero images are intact
  const authenticImages = {
    'utility-remote-monitoring': 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/c1b72fbe-f62e-4b64-b830-ff30b1036300.jpeg',
    'boiler-automation': 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/2039b2d1-fbd7-49ce-9f3b-0bfc87ed3845.jpeg',
    'ash-handling-system': 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/e84684da-ca20-4057-8a6a-d23682c48ba9.jpeg',
    'fuel-handling-system': 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/535da449-8404-4ebd-b4d8-dcaa109d81ca.jpg',
    'boiler-automation-steam-fuel-tracker': 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/6e635364-0a95-4f04-83d4-2011c990e02a.png',
    'boiler-bag-filter-water-treatment-spares': 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/0bcd7f10-8afa-4176-8a4a-94c441df5406.jfif',
    'steam-energy-loss-diagnosis': 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/cffc2575-449d-4315-b1e8-0107ef09c583.jpeg',
    'project-consultation-management': 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/9270c9ad-3dca-4c9e-b37e-f252059e5d4b.jpeg',
    'heat-pump-chilling-bop-management': 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/a83f4232-0668-49e4-bc18-6be621323eef.jpeg'
  };

  for (const [slug, img] of Object.entries(authenticImages)) {
    await sql`
      UPDATE solutions
      SET hero_image_url = ${img}
      WHERE slug = ${slug}
    `;
  }
  console.log('Restored all 9 authentic hero images.');

  // 4. Verify
  const rows = await sql`SELECT slug, title, hero_image_url, sub_products FROM solutions ORDER BY sort_order ASC`;
  for (const r of rows) {
    console.log(`${r.slug}: hero_img=${r.hero_image_url?.substring(0, 50)}... sub_count=${r.sub_products ? r.sub_products.length : 0}`);
  }

  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
