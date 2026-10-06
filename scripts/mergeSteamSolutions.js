import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function merge() {
  console.log('Merging steam solutions in Supabase...');

  // 1. Update the steam-fuel-tracker solution with merged content
  const { data: updated, error: updateErr } = await supabase
    .from('solutions')
    .update({
      title: 'BOILER AUTOMATION & STEAM, FUEL TRACKER SYSTEM',
      slug: 'boiler-automation-steam-fuel-tracker',
      category: 'BOILER AUTOMATION & DIGITAL UTILITIES',
      short_description: 'Smart PLC & SCADA boiler house automation with real-time fuel-to-steam tracking, auto-combustion, draft control, and telemetry.',
      full_description: 'STEAM FUEL TRACKER is an intelligent data logging and automation platform combining industrial load cells and steam flow meters. Integrated with PLC & SCADA, it calculates real-time Steam-to-Fuel (Evaporation) ratios, manages draft control, and eliminates energy distribution losses.\n1. Bunker load cell gravimetric weighing\n2. High-accuracy steam vortex mass flow metering\n3. Closed-loop PLC auto-combustion and draft control\n4. SCADA telemetry, cloud dashboards & shift consumption reporting',
      features: [
        'Precision Load-Cell Weight Sensing under Bunker',
        'Vortex Steam Flow Mass Meter Integration',
        'Live Calculation of Steam-to-Fuel Ratio (Evaporation Ratio)',
        'Closed-Loop Auto Combustion & Draft Modulation via VFD',
        '7-Inch Industrial Touch HMI with Shift Report Printing',
      ],
      deliverables: [
        'Load cell mounting module & weighing bunker retrofit',
        'Pre-programmed PLC & HMI SCADA assembly',
        'Vortex steam mass flow station with temperature compensation',
        'Exportable CSV/PDF shift audit log software',
      ],
      technical_specs: {
        'Weighing Accuracy': '±0.1% Full Scale',
        'Flow Accuracy': '±0.75% of reading',
        'Display': '7-inch / 10-inch Industrial Touchscreen HMI',
        'Communication': 'Modbus RS485 / Ethernet / Cloud IoT',
      },
      sub_products: [
        {
          id: 'sft-1',
          name: 'Fuel Measuring Bunker with Strain Load Cells',
          image_url: 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/6e635364-0a95-4f04-83d4-2011c990e02a.png',
          description: 'Precision weight measuring fuel skid with anti-vibration mountings.',
          technical_specs: {
            'Weighing Accuracy': '±0.1% of Full Scale',
            'Load Cell Rating': '4x 2000 Kg IP68 Stainless Steel Cells',
            'Junction Box': 'Cast Aluminum IP67 Summing Box with surge protection',
            'Sampling Rate': '50 samples per second digital filtering',
          },
        },
        {
          id: 'sft-2',
          name: 'Antrixx Steam Flow Mass Metering Station',
          image_url: 'https://cjaeubdycgnwgfkbddvb.supabase.co/storage/v1/object/public/general/9cfca206-8f43-4fb3-a7c1-f197de9d9226.jpeg',
          description: 'Flanged vortex shedding flowmeter with integrated RTD and pressure compensation.',
          technical_specs: {
            'Line Sizes': 'DN25 to DN300 (1" to 12")',
            'Flow Accuracy': '±0.75% for steam and gas',
            'Pressure Rating': 'ANSI 150# / 300# / IBR Approved',
            'Output': '4-20mA HART, RS485 Modbus RTU',
          },
        },
        {
          id: 'sft-3',
          name: 'Auto-Combustion & Boiler PLC SCADA Panel',
          image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
          description: 'Closed-loop combustion, draft modulation, and automatic fuel-air ratio control.',
          technical_specs: {
            'PLC Platform': 'Siemens S7-1200 / Allen Bradley',
            'HMI Display': '7-inch / 10-inch Color Touch HMI',
            'Communication': 'Modbus TCP / RTU / Ethernet IP',
            'Control Loop': 'Furnace draft, drum level, and VFD fan speed',
          },
        },
      ],
      sort_order: 5,
    })
    .eq('id', '66ed45f6-46ef-4a9d-bf1d-f1c7ab468f6d');

  if (updateErr) console.error('Error updating solution:', updateErr.message);
  else console.log('Successfully updated steam solution!');

  // 2. Delete the redundant steam-engineering-automation solution
  const { error: delErr } = await supabase
    .from('solutions')
    .delete()
    .eq('id', 'aea4671f-0f09-46d6-a064-9cfada3ab3cf');

  if (delErr) console.error('Error deleting duplicate:', delErr.message);
  else console.log('Successfully deleted duplicate steam-engineering-automation!');

  // 3. Re-order all remaining solutions sequentially
  const { data: allSolutions } = await supabase.from('solutions').select('id, title, sort_order').order('sort_order');
  if (allSolutions) {
    for (let i = 0; i < allSolutions.length; i++) {
      await supabase.from('solutions').update({ sort_order: i + 1 }).eq('id', allSolutions[i].id);
    }
    console.log(`Re-ordered ${allSolutions.length} solutions (1 to ${allSolutions.length})`);
  }

  console.log('Merge complete!');
}

merge();
