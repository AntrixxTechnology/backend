import fs from 'fs';
import path from 'path';

const dataDir = path.resolve(process.cwd(), 'data');
const publicDir = path.resolve(process.cwd(), 'public');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// Copy source assets from Details
const sourcePdfPath = path.resolve(process.cwd(), '../Details/ANTRIXX TECHNOLOGY PROFILE.pdf');
const sourceLogoPath = path.resolve(process.cwd(), '../Details/logo.png');

if (fs.existsSync(sourcePdfPath)) {
  fs.copyFileSync(sourcePdfPath, path.join(publicDir, 'profile.pdf'));
  console.log('[Seed] Copied ANTRIXX TECHNOLOGY PROFILE.pdf -> backend/public/profile.pdf');
}

if (fs.existsSync(sourceLogoPath)) {
  fs.copyFileSync(sourceLogoPath, path.join(publicDir, 'logo.png'));
  console.log('[Seed] Copied logo.png -> backend/public/logo.png');
}

function writeJson(filename: string, data: any) {
  fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2), 'utf-8');
  console.log(`[Seed] Written ${filename}`);
}

// 1. Hero Content
const heroData = {
  id: 'hero-1',
  badge: 'INDUSTRIAL AUTOMATION & ENERGY SOLUTIONS',
  headline: 'Engineering Intelligence.',
  accent_text: 'Powering Industries.',
  description: 'Antrixx Technology delivers high-efficiency boiler house automation, utility remote monitoring, pollution control systems, and balance-of-plant management tailored for enterprise manufacturing.',
  primary_cta_text: 'EXPLORE SOLUTIONS',
  primary_cta_link: '/solutions',
  secondary_cta_text: 'DOWNLOAD BROCHURE',
  secondary_cta_link: '/resources/downloads',
  background_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
  scada_plant_efficiency: 94,
  scada_steam_flow: 12.45,
  scada_fuel_consumption: 850,
  scada_energy_saved_mwh: 1240,
  is_published: true,
};

// 2. Stats Data
const statsData = [
  { id: 's1', label: 'Projects Completed', value_number: 500, suffix: '+', description: 'Pan-India boiler house & BOP projects', icon_name: 'Factory', sort_order: 1, is_published: true },
  { id: 's2', label: 'Client Satisfaction', value_number: 98, suffix: '%', description: 'Trusted by leading FMCG & Textile plants', icon_name: 'Smile', sort_order: 2, is_published: true },
  { id: 's3', label: 'Technical Support', value_number: 24, suffix: 'x7', description: 'Rapid field dispatch & diagnostic support', icon_name: 'Headphones', sort_order: 3, is_published: true },
  { id: 's4', label: 'Industrial Solutions', value_number: 15, suffix: '+', description: 'Turnkey thermal engineering verticals', icon_name: 'Cpu', sort_order: 4, is_published: true },
  { id: 's5', label: 'Years of Excellence', value_number: 10, suffix: '+', description: 'Biomass combustion & utility expertise', icon_name: 'ShieldCheck', sort_order: 5, is_published: true },
];

// 3. ALL 12 CORE SERVICES EXTRACTED FROM PDF
const solutionsData = [
  {
    id: 'sol-1',
    slug: 'utility-remote-monitoring',
    title: 'Utility Remote Monitoring System',
    category: 'IoT & Digital Utilities',
    short_description: 'Real-time telemetry and cloud analytics monitoring plant steam flow, boiler efficiency, and utility health 24/7.',
    full_description: 'Our Utility Remote Monitoring System provides enterprise plant managers with continuous operational intelligence. By integrating high-precision sensor arrays, field PLCs, and cloud-enabled SCADA telemetry, Antrixx enables real-time tracking of steam generation, fuel burn rates, flue gas temperatures, and utility power draw.',
    icon_name: 'Activity',
    hero_image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    features: [
      '24/7 Cloud Telemetry & Mobile Dashboard',
      'Automated Alert Triggers via SMS & Email',
      'Historical Trend Analysis & Fuel-to-Steam Ratio Logging',
      'Multi-Plant Fleet Management Integration'
    ],
    deliverables: [
      'Plug-and-play IoT gateway panel installation',
      'Custom SCADA HMI dashboard configuration',
      'Monthly thermal efficiency audit reports'
    ],
    technical_specs: {
      'Communication': 'Modbus RS485 / Ethernet / MQTT',
      'Data Logging Rate': 'Every 1 second',
      'Sensor Compatibility': 'Steam Flow, Pressure, Temp, O2, Load Cell'
    },
    sort_order: 1,
    is_published: true
  },
  {
    id: 'sol-2',
    slug: 'boiler-automation',
    title: 'Boiler Automation & Draft Control',
    category: 'Boiler House Control',
    short_description: 'Integrated Auto Combustion, Auto Draft, and Drum Level Control systems for precision firing and fuel reduction.',
    full_description: 'Transform manual boiler operations into a self-optimizing thermal asset. Antrixx Boiler Automation delivers complete closed-loop control over furnace draft, forced/induced draft fan speeds, fuel feeder rates, and drum level water modulation.',
    icon_name: 'Gauge',
    hero_image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Closed-Loop Auto Combustion Control',
      'PID Drum Level Modulation (3-Element Control)',
      'Furnace Draft Control via VFD-driven ID/FD Fans',
      'Touchscreen HMI with Intuitive SCADA Synoptics'
    ],
    deliverables: [
      'Custom PLC & VFD Automation Panel',
      'Differential Pressure & Level Transmitters',
      'O2 Flue Gas Analyzer Integration'
    ],
    technical_specs: {
      'PLC Platform': 'Siemens S7-1200 / Allen Bradley',
      'Draft Accuracy': '±0.5 mm WC',
      'VFD Response': '< 200 ms dynamic loop response'
    },
    sort_order: 2,
    is_published: true
  },
  {
    id: 'sol-3',
    slug: 'pollution-control-equipment',
    title: 'Pollution Control Equipment',
    category: 'Environmental & Emission Systems',
    short_description: 'High-efficiency Bag Filters, Cyclone Dust Collectors, and Wet Scrubbers ensuring clean, compliant flue gas emissions.',
    full_description: 'Ensure total environmental compliance while maintaining optimal boiler draft performance. Antrixx engineers and supplies heavy-duty flue gas cleaning systems including Cyclone Dust Collectors, Pulse-Jet Bag Filters (1.0 Air-to-Cloth ratio), and Spray-type Wet Scrubbers.',
    icon_name: 'Wind',
    hero_image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Cyclone Dust Collectors with Heavy-Duty Abrasion Liners',
      'Pulse-Jet Bag Filters guaranteed at 1.0 Air-to-Cloth Ratio',
      'Wet Scrubbers with Continuous Water Filtration & Re-circulation',
      'Particulate Emissions Guaranteed < 30 mg/Nm³'
    ],
    deliverables: [
      'Turnkey structural casing, filter bags, and cages',
      'Sequential pulse controller panel & solenoid valves',
      'Recirculation slurry pumps & secondary filtration unit'
    ],
    technical_specs: {
      'Air-to-Cloth Ratio': '1.0 m/min (Strict Design Limit)',
      'Filter Bag Material': 'Nomex / PPS / Fiberglass with PTFE Membrane',
      'Collection Efficiency': '99.8% down to 1 micron'
    },
    sort_order: 3,
    is_published: true
  },
  {
    id: 'sol-4',
    slug: 'ash-handling-system',
    title: 'Ash Handling Systems',
    category: 'Solid Material Handling',
    short_description: 'Clean, enclosed Low Pressure and Vacuum Ash Conveying systems for rapid bed-ash and fly-ash transfer.',
    full_description: 'Antrixx Ash Handling Systems eliminate dust generation, manual labor, and thermal hazards associated with boiler ash removal. We offer Low Pressure Pneumatic Conveying and fully enclosed Vacuum Ash Conveying Systems.',
    icon_name: 'Layers',
    hero_image_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Clean, Dust-Free Vacuum Ash Extraction',
      'Low Pressure Pneumatic Conveying for Heavy Bed Ash',
      'Multi-Point Hopper Pick Up with Automated Rotary Air-locks',
      'Heavy-Duty Abrasion Resistant Pipe Bends'
    ],
    deliverables: [
      'Vacuum exhauster blowers & cyclone separators',
      'Pneumatic ash conditioners & unloading chutes',
      'Automated PLC sequence controller'
    ],
    technical_specs: {
      'Conveying Capacity': '1 to 25 TPH',
      'Operating Vacuum': '-400 to -600 mbar',
      'Material': 'Basalt-lined / Hardened Cast Iron Elbows'
    },
    sort_order: 4,
    is_published: true
  },
  {
    id: 'sol-5',
    slug: 'fuel-handling-system',
    title: 'Fuel Handling Systems',
    category: 'Solid Material Handling',
    short_description: 'End-to-end solid fuel receiving, crushing, screening, storage, and furnace feeding for husk, briquettes, and coal.',
    full_description: 'Uninterrupted fuel supply is essential for continuous steam production. Antrixx delivers rugged, automated fuel handling systems designed for solid fuels including rice husk, wood chips, biomass briquettes, and coal.',
    icon_name: 'Truck',
    hero_image_url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Heavy-Duty Storage Hoppers & Storage Silos',
      'Belt, Screw, and Drag Chain Conveyor Assemblies',
      'Fuel Crusher & Screening Vibratory Units',
      'Variable-Speed Furnace Feeder Drives with PLC Sync'
    ],
    deliverables: [
      'Complete mechanical handling structure & galleries',
      'Elevator towers, belt trippers, & magnetic separators',
      'Motor control centers (MCC) & interlocked safety panels'
    ],
    technical_specs: {
      'Fuel Types': 'Rice Husk, Coal, Wood Chips, Mustard Stalk, Briquettes',
      'Throughput': 'Up to 50 TPH handling capacity',
      'Feeder Drive': 'VFD synchronized with combustion controller'
    },
    sort_order: 5,
    is_published: true
  },
  {
    id: 'sol-6',
    slug: 'steam-fuel-tracker',
    title: 'Steam Fuel Tracker System',
    category: 'IoT & Digital Utilities',
    short_description: 'Smart data logging system combining industry load cells and steam flow meters to calculate real-time steam-to-fuel ratios.',
    full_description: 'The STEAM FUEL TRACKER is Antrixx proprietary intelligent data logging platform. Utilizing heavy-duty strain gauge load cells under the fuel measuring bunker alongside vortex steam flow meters, the system calculates exact Steam-to-Fuel Ratios in real time.',
    icon_name: 'Cpu',
    hero_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Precision Load-Cell Weight Sensing under Bunker',
      'Vortex Steam Flow Mass Meter Integration',
      'Live Calculation of Steam-to-Fuel Ratio (Evaporation Ratio)',
      '7-Inch Industrial Touch HMI with Shift Report Printing'
    ],
    deliverables: [
      'Load cell mounting module & weighing bunker retrofit',
      'Pre-programmed PLC & HMI SCADA assembly',
      'Exportable CSV/PDF shift audit log software'
    ],
    technical_specs: {
      'Weighing Accuracy': '±0.1% Full Scale',
      'Flow Accuracy': '±1.0% of reading',
      'Display': '7-inch TFT 65K color touchscreen'
    },
    sort_order: 6,
    is_published: true
  },
  {
    id: 'sol-7',
    slug: 'steam-engineering-automation',
    title: 'Steam Engineering Automation',
    category: 'Steam & Thermal Systems',
    short_description: 'Smart trap monitoring, automated blowdown, flash steam recovery, PRVs, and motorized steam control valves.',
    full_description: 'Maximize thermal output while neutralizing steam distribution losses across process plants. Antrixx Steam Engineering Automation encompasses advanced steam flow metering, thermic fluid heat meters, automated boiler TDS blowdown control, flash steam recovery units, and pressure reducing stations.',
    icon_name: 'Zap',
    hero_image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Boiler TDS Auto-Blowdown Control Systems',
      'Flash Steam Recovery Units & Condensate Polishing',
      'Pneumatic Actuated Control Valves & PRV Stations',
      'Thermic Fluid Heat Energy Meters'
    ],
    deliverables: [
      'Pre-engineered PRV station skids',
      'Blowdown conductivity sensor & motorized valve assembly',
      'Comprehensive steam piping & trap survey reports'
    ],
    technical_specs: {
      'Pressure Range': 'Up to 32 bar steam pressure',
      'Control Valve Duty': 'Class VI Shut-off pneumatic actuation',
      'TDS Sensor': 'High-temperature electrode conductivity cell'
    },
    sort_order: 7,
    is_published: true
  },
  {
    id: 'sol-8',
    slug: 'boiler-bag-filter-water-treatment-spares',
    title: 'Boiler, Bag Filter & Water Spares',
    category: 'Industrial Spares & Components',
    short_description: 'Precision-engineered spare parts for boilers, filter bags, cages, membranes, dosing pumps, and steam accessories.',
    full_description: 'Ensure zero unexpected downtime with Antrixx premium industrial spares. We supply OEM-standard replacement parts including boiler grate bars, economizer tubes, steam valves, Nomex filter bags, filter cages, RO membranes, and dosing pumps.',
    icon_name: 'Wrench',
    hero_image_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Fast Dispatch on Critical Stocked Spares',
      'High-Temperature Nomex & PPS Filter Bags',
      'Precision-Cast Boiler Grate Bars & Castables',
      'Industrial Water Treatment Membranes & Dosing Pumps'
    ],
    deliverables: [
      'Direct OEM-spec component delivery',
      'Emergency 24-hour dispatch program',
      'On-site installation and fitting guidance'
    ],
    technical_specs: {
      'Quality Standard': 'ISO / ASME Grade Metallurgy',
      'Filter Bag Specs': 'Singed & Calendered Finish, Hydrophobic Treatment',
      'Pump Specs': 'Metering Dosing Pumps up to 100 LPH'
    },
    sort_order: 8,
    is_published: true
  },
  {
    id: 'sol-9',
    slug: 'steam-energy-loss-diagnosis',
    title: 'Steam & Energy Loss Diagnosis',
    category: 'Audits & Diagnostic Services',
    short_description: 'Data-backed thermal imaging and ultrasonic leak audits uncovering hidden steam traps, insulation, and boiler losses.',
    full_description: 'Uncover hidden plant energy wastage with quantitative financial accuracy. Antrixx specialized Steam & Energy Loss Diagnosis employs non-invasive thermal imaging cameras, ultrasonic leak detectors, and portable flow meters.',
    icon_name: 'Search',
    hero_image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Non-Invasive Ultrasonic Steam Trap Testing',
      'FLIR Thermal Imaging of Pipe Insulation & Furnace Walls',
      'Direct & Indirect Boiler Efficiency Measurement',
      'Quantified Financial Loss Report & ROI Implementation Plan'
    ],
    deliverables: [
      'Complete steam trap condition register',
      'Infrared thermography defect report',
      'Actionable retrofitting proposal with payback period'
    ],
    technical_specs: {
      'Audit Tools': 'FLIR Thermal Imager, UE Systems Ultrasonic Detector, Portable Flow Meter',
      'Methodology': 'BS 845 / ASME PTC 4.1 Boiler Testing Standard',
      'Report Turnaround': 'Within 5 business days'
    },
    sort_order: 9,
    is_published: true
  },
  {
    id: 'sol-10',
    slug: 'retrofitting-boiler-thermic-fluid-heater',
    title: 'Retrofitting of Boiler & Thermic Fluid Heater',
    category: 'Boiler House Control',
    short_description: 'Upgrade existing boilers and thermic heaters with modern combustion, economizers, and PLC automation without replacement.',
    full_description: 'Revitalize aging thermal infrastructure without the capital expense of buying a new boiler. Antrixx specializes in retrofitting underperforming boilers and thermic fluid heaters.',
    icon_name: 'RefreshCw',
    hero_image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Furnace Conversion for Biomass, Husk & Coal Dual-Fuel Duty',
      'Installing Condensing Economizers & Waste Heat Recovery',
      'PLC/HMI Control Upgrades to Eliminate Unburnt Carbon',
      'Refractory Reconstruction & High-Density Insulation'
    ],
    deliverables: [
      'Turnkey mechanical overhaul and piping modification',
      'Pressure vessel inspection compliance support',
      'Commissioning and thermal efficiency re-certification'
    ],
    technical_specs: {
      'Efficiency Boost': '5% to 15% thermal efficiency increase',
      'Payback Period': 'Typically 6 to 14 months',
      'Downtime': 'Scheduled minimal maintenance window'
    },
    sort_order: 10,
    is_published: true
  },
  {
    id: 'sol-11',
    slug: 'project-consultation-management',
    title: 'Project Consultation & Management',
    category: 'Turnkey Engineering',
    short_description: 'End-to-end layout planning, balance-of-plant design, equipment selection, and turnkey boiler house commissioning.',
    full_description: 'From initial greenfield concept to fully operational utility house, Antrixx delivers comprehensive project consultation and turnkey balance-of-plant management.',
    icon_name: 'Briefcase',
    hero_image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop',
    features: [
      '3D Utility Layout Planning & Pipe Sizing Engineering',
      'Boiler House & Cooling System BOP Custom Integration',
      'Regulatory Environmental & Boiler Inspection Compliance',
      'Full Supervision from Civil Foundation to Steam Trial'
    ],
    deliverables: [
      'Detailed P&ID drawings and 3D CAD models',
      'Vendor evaluation & equipment procurement assistance',
      'Site execution management and commissioning certificate'
    ],
    technical_specs: {
      'Engineering Standard': 'IS 2825 / ASME Section I & VIII / IBR',
      'Coverage': 'Boiler House, Chiller Plant, Piping Layouts, Water Treatment',
      'Project Delivery': 'Turnkey EPC or Management Consultancy'
    },
    sort_order: 11,
    is_published: true
  },
  {
    id: 'sol-12',
    slug: 'heat-pump-chilling-bop-management',
    title: 'Heat Pump & Chilling System BOP Management',
    category: 'Turnkey Engineering',
    short_description: 'Integrated Balance-of-Plant management for industrial heat pumps, chilling water loops, and waste heat recovery.',
    full_description: 'Antrixx manages complete Balance-of-Plant (BOP) engineering for industrial heat pumps and chiller systems (including reference management for systems from Kirloskar Chillers).',
    icon_name: 'Thermometer',
    hero_image_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1200&auto=format&fit=crop',
    features: [
      'Industrial Heat Pump & Chilling Water System Integration',
      'Hydronic Loop Balancing & Secondary Pumping Skids',
      'Waste Heat Recovery & Combined Heating/Cooling Integration',
      'Turnkey Testing, Commissioning, and Plant Operator Training'
    ],
    deliverables: [
      'Primary/Secondary chiller piping & valving skid',
      'Heat exchanger integration & thermal buffer tanks',
      'Automated chiller plant management panel'
    ],
    technical_specs: {
      'System Scope': 'Balance-of-Plant Integration & Utility Management',
      'Temperature Range': 'Chilled Water 4°C to Hot Water 85°C',
      'COP Improvement': 'Up to 35% energy reduction vs conventional heating/chilling'
    },
    sort_order: 12,
    is_published: true
  }
];

// 4. ALL 10 ENTERPRISE CLIENTS EXTRACTED FROM PDF
const clientLogosData = [
  { id: 'client-1', name: 'ITC Limited', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=300&auto=format&fit=crop', website_url: 'https://www.itcportal.com', sort_order: 1, is_published: true },
  { id: 'client-2', name: "Haldiram's", logo_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=300&auto=format&fit=crop', website_url: 'https://www.haldiram.com', sort_order: 2, is_published: true },
  { id: 'client-3', name: 'CG Chaudhary Group', logo_url: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?q=80&w=300&auto=format&fit=crop', website_url: 'https://www.cgcorpglobal.com', sort_order: 3, is_published: true },
  { id: 'client-4', name: 'Lalbaba Rice', logo_url: 'https://images.unsplash.com/photo-1542744094-3a3172720449?q=80&w=300&auto=format&fit=crop', website_url: 'https://www.lalbabarice.com', sort_order: 4, is_published: true },
  { id: 'client-5', name: 'Yellow Diamond', logo_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300&auto=format&fit=crop', website_url: 'https://www.prataapsnacks.com', sort_order: 5, is_published: true },
  { id: 'client-6', name: 'Nimbus', logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop', website_url: '#', sort_order: 6, is_published: true },
  { id: 'client-7', name: 'Ramdev / Tam Tam', logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=300&auto=format&fit=crop', website_url: '#', sort_order: 7, is_published: true },
  { id: 'client-8', name: 'Prabhuji Pure Food', logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop', website_url: '#', sort_order: 8, is_published: true },
  { id: 'client-9', name: 'Coca-Cola', logo_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop', website_url: 'https://www.coca-colacompany.com', sort_order: 9, is_published: true },
  { id: 'client-10', name: 'Kirloskar Chillers', logo_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=300&auto=format&fit=crop', website_url: 'https://www.kirloskar.com', sort_order: 10, is_published: true }
];

// 5. Industries Data
const industriesData = [
  { id: 'ind-1', slug: 'food-processing-fmcg', title: 'Food Processing & FMCG', description: 'Clean steam generation, strict temperature controls, and high-efficiency heat recovery.', icon_name: 'Utensils', image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop', key_benefits: ['Contamination-free clean steam', 'Automated batch cooking control', 'Flash steam recovery'], sort_order: 1, is_published: true },
  { id: 'ind-2', slug: 'beverages', title: 'Beverages & Bottling', description: 'Integrated chilling BOP management, boiler automation, and pasteurization thermal recovery.', icon_name: 'Coffee', image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=800&auto=format&fit=crop', key_benefits: ['Precise pasteurization pressure control', 'High COP chilled water loop', 'Zero line stops'], sort_order: 2, is_published: true },
  { id: 'ind-3', slug: 'textile-processing', title: 'Textile & Dyeing Mills', description: 'High-volume process steam, thermic fluid heater automation, and condensate return.', icon_name: 'Layers', image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop', key_benefits: ['Stable thermic fluid temperature', 'Maximum condensate recovery', 'Zero unburnt fuel loss'], sort_order: 3, is_published: true },
  { id: 'ind-4', slug: 'rice-agro-processing', title: 'Rice & Agro Processing', description: 'Rice husk fuel handling, fluidized bed boiler automation, ash extraction, and parboiling steam.', icon_name: 'Wheat', image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop', key_benefits: ['Automated rice husk feeding', 'Evaporation ratio tracking', 'Compliant bag filter emission'], sort_order: 4, is_published: true },
  { id: 'ind-5', slug: 'pharma-chemical', title: 'Pharma & Chemical', description: 'Precision boiler drum level regulation, pure steam line diagnosis, and automated TDS blowdown.', icon_name: 'FlaskConical', image_url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop', key_benefits: ['Strict TDS automated regulation', 'Vortex steam flow metering', 'Ultrasonic trap audits'], sort_order: 5, is_published: true },
  { id: 'ind-6', slug: 'heavy-manufacturing', title: 'Heavy Manufacturing', description: 'Turnkey boiler house engineering, multi-plant remote monitoring, and energy loss retrofits.', icon_name: 'Factory', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop', key_benefits: ['Custom balance-of-plant EPC', 'Fast dispatch replacement spares', '24/7 technical support'], sort_order: 6, is_published: true }
];

// 6. Projects Data
const projectsData = [
  {
    id: 'proj-1',
    slug: 'fmcg-boiler-automation-retrofit',
    title: 'Boiler House Automation & SCADA Retrofit',
    client_name: "Haldiram's Processing Unit",
    industry: 'Food Processing & FMCG',
    location: 'West Bengal, India',
    challenge: 'Manual furnace draft control resulted in frequent steam pressure drops and high unburnt fuel waste.',
    solution: 'Installed Antrixx closed-loop Auto Combustion & Auto Draft Control system with VFD fan controls and HMI SCADA.',
    results: [
      '14.5% Reduction in Solid Fuel Consumption',
      '99.2% Steam Pressure Stability during Peak Loads',
      'Payback Period achieved in less than 7 months'
    ],
    image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
    sort_order: 1,
    is_published: true
  },
  {
    id: 'proj-2',
    slug: 'agro-steam-fuel-tracker-installation',
    title: 'Steam Fuel Tracker & Remote Telemetry Implementation',
    client_name: 'Lalbaba Rice Mill',
    industry: 'Rice & Agro Processing',
    location: 'Burdwan, West Bengal',
    challenge: 'Lack of real-time visibility into husk consumption quality and steam evaporation ratios.',
    solution: 'Integrated Antrixx Steam Fuel Tracker featuring load-cell equipped measuring bunker and vortex steam flow meter.',
    results: [
      'Real-time tracking of Husk-to-Steam Evaporation Ratio',
      'Identified and eliminated 12% moisture-related fuel losses',
      'Zero un-budgeted steam downtime over 12 months'
    ],
    image_url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop',
    sort_order: 2,
    is_published: true
  },
  {
    id: 'proj-3',
    slug: 'beverage-chilling-bop-engineering',
    title: 'Chilling Water BOP & Thermal Optimization',
    client_name: 'Coca-Cola Bottling Partner Plant',
    industry: 'Beverages',
    location: 'Eastern Region, India',
    challenge: 'High power consumption in secondary glycol/water pumping loops and uneven thermal distribution.',
    solution: 'Designed and commissioned complete Balance-of-Plant hydronic pumping skids and automated control valves.',
    results: [
      '22% Energy Reduction in Chilled Water Pumping',
      'Precise ±0.2°C Temperature Holding at Bottling Line',
      'Seamless integration with plant chillers'
    ],
    image_url: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?q=80&w=800&auto=format&fit=crop',
    sort_order: 3,
    is_published: true
  },
  {
    id: 'proj-4',
    slug: 'pollution-control-bag-filter-turnkey',
    title: 'Pulse-Jet Bag Filter & Ash Handling Turnkey Project',
    client_name: 'CG Chaudhary Group Unit',
    industry: 'General Manufacturing',
    location: 'Nepal / India Border Facility',
    challenge: 'Flue gas particulate emissions exceeding environmental standards during heavy biomass boiler firing.',
    solution: 'Designed and erected turnkey Pulse-Jet Bag Filter operating strictly at 1.0 Air-to-Cloth ratio.',
    results: [
      'Flue Gas Emission reduced to < 22 mg/Nm³',
      '100% Dust-free ash discharge into storage silos',
      'Achieved full PCB environmental compliance certification'
    ],
    image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&auto=format&fit=crop',
    sort_order: 4,
    is_published: true
  }
];

// 7. Testimonials Data
const testimonialsData = [
  {
    id: 'test-1',
    author_name: 'Rajesh Sharma',
    author_role: 'General Manager - Utility Operations',
    company_name: 'Haldiram Foods Manufacturing',
    quote: "Antrixx Technology's boiler draft control and steam loss diagnosis completely transformed our utility room efficiency. We saved over 14% on monthly fuel costs.",
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    sort_order: 1,
    is_published: true
  },
  {
    id: 'test-2',
    author_name: 'Amitabha Das',
    author_role: 'Chief Plant Engineer',
    company_name: 'Lalbaba Rice Industries',
    quote: 'The Steam Fuel Tracker system gives our management team live transparency on husk consumption per ton of steam. Antrixx engineers know industrial steam inside out.',
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    sort_order: 2,
    is_published: true
  },
  {
    id: 'test-3',
    author_name: 'Siddharth Roy',
    author_role: 'Head of Engineering & BOP',
    company_name: 'Prabhuji Pure Food',
    quote: 'Their fast dispatch on boiler spares and 24/7 technical support saved us during a major production peak. Reliable, professional, and zero fluff engineering.',
    rating: 5,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    sort_order: 3,
    is_published: true
  }
];

// 8. About Data
const aboutData = {
  id: 'about-1',
  company_story: 'Antrixx Technology was established by a team of veteran thermal and utility automation engineers dedicated to optimizing industrial energy efficiency across India. Operating extensively across process industries—including food processing, FMCG, rice & agro processing, textiles, beverages, and chemicals—our team specializes in the sales, engineering, installation, and balance-of-plant service for boilers, thermic fluid heaters, hot water generators, steam automation, and industrial water treatment facilities.',
  mission: 'To transform industrial utility operations through smart automation, rigorous energy loss diagnostics, and sustainable balance-of-plant engineering that minimizes fuel costs and carbon footprint.',
  vision: 'To be the most trusted industrial thermal and utility optimization engineering partner in South Asia, recognized for zero-downtime solutions and data-backed operational excellence.',
  values: [
    'Industrial Reliability — Zero compromises on component metallurgy, safety, or control precision.',
    'Data-Backed Integrity — Every efficiency recommendation is validated by calibrated sensors.',
    'Pan-India SLA Agility — Rapid field dispatch and continuous technical support.'
  ],
  capabilities: [
    'Boiler House & Thermic Fluid Heater Automation',
    'Utility Remote Monitoring & SCADA Telemetry',
    'Pollution Control Systems (Bag Filters, Scrubbers, Cyclones)',
    'Pneumatic & Vacuum Ash Handling Systems',
    'Solid Fuel Storage & Automated Conveying',
    'Steam Engineering Automation (PRVs, Blowdown, Traps)',
    'Industrial Spares Dispatch & Emergency Replacements',
    'Thermal Loss Diagnostics & Efficiency Audits',
    'Heat Pump & Chilling System BOP Management'
  ],
  hero_image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop'
};

// 9. Team Data
const teamData = [
  {
    id: 'team-1',
    name: 'Managing Director & Chief Engineer',
    role: 'Thermal Engineering & Utility Strategy',
    bio: 'Over 20 years of hands-on experience in industrial boiler house design, biomass combustion engineering, and utility balance-of-plant management.',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    linkedin_url: 'https://linkedin.com',
    sort_order: 1,
    is_published: true
  },
  {
    id: 'team-2',
    name: 'Head of Automation & SCADA Systems',
    role: 'Controls & Telemetry Lead',
    bio: 'Specializes in PLC/HMI automation, IoT remote monitoring telemetry, combustion control loops, and digital steam fuel tracking systems.',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    linkedin_url: 'https://linkedin.com',
    sort_order: 2,
    is_published: true
  },
  {
    id: 'team-3',
    name: 'Lead Field Service & Commissioning Engineer',
    role: 'Spares & On-Site Projects',
    bio: 'Directs pan-India field dispatch, bag filter erection, boiler retrofitting, and 24/7 technical support operations.',
    image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
    linkedin_url: 'https://linkedin.com',
    sort_order: 3,
    is_published: true
  }
];

// 10. Resources Data
const resourcesData = [
  {
    id: 'res-1',
    slug: 'boiler-combustion-auto-draft-control-roi',
    title: 'Optimizing Biomass Boiler Efficiency via Auto Draft & Closed-Loop Combustion Control',
    summary: 'How modern VFD-driven furnace draft control and continuous O2 trim reduce solid fuel consumption by 12% to 18% in agro and FMCG plants.',
    content: '### Introduction\n\nSolid fuels like rice husk, mustard stalk, briquettes, and coal present volatile burning characteristics inside industrial boiler furnaces. Manual damper adjustments frequently lead to excessive unburnt carbon loss, high flue gas temperatures, or dark smoke emissions.\n\n### The Science of Closed-Loop Draft Control\n\nBy synchronizing Induced Draft (ID) fan and Forced Draft (FD) fan speeds via variable frequency drives (VFDs) and differential pressure transmitters, Antrixx Auto Draft Control maintains furnace pressure within a strict ±0.5 mm WC envelope.',
    category: 'Technical Guide',
    author: 'Antrixx Engineering Team',
    read_time: '6 min read',
    cover_image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
    download_file_url: '/api/resources/downloads/profile-pdf',
    published_date: '2026-08-01T10:00:00.000Z',
    sort_order: 1,
    is_published: true
  },
  {
    id: 'res-2',
    slug: 'steam-trap-energy-loss-diagnosis',
    title: 'Uncovering Hidden Dollars: A Guide to Non-Invasive Steam Trap & Line Audit',
    summary: 'Learn how ultrasonic leak detection and infrared thermography identify failed steam traps and un-insulated lines before they inflate utility bills.',
    content: '### Why Steam Traps Fail Silently\n\nUp to 20% of steam traps in an un-audited industrial facility are blowing live steam straight into condensate lines or atmosphere.',
    category: 'Energy Audits',
    author: 'Antrixx Diagnostic Division',
    read_time: '5 min read',
    cover_image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
    download_file_url: '/api/resources/downloads/profile-pdf',
    published_date: '2026-08-04T10:00:00.000Z',
    sort_order: 2,
    is_published: true
  }
];

// 11. Job Openings Data
const jobOpeningsData = [
  {
    id: 'job-1',
    title: 'Senior Thermal & Automation Engineer',
    department: 'Engineering & Controls',
    location: 'Kolkata, West Bengal',
    type: 'Full-time',
    experience: '4–7 Years',
    description: 'Lead closed-loop boiler combustion control design, PLC programming, and on-site utility commissioning.',
    requirements: ['Degree in Mechanical/Electrical/Instrumentation Engineering', 'Hands-on experience with Siemens/AB PLCs', 'Knowledge of IBR boiler codes'],
    sort_order: 1,
    is_published: true
  },
  {
    id: 'job-2',
    title: 'Field Commissioning & Service Engineer',
    department: 'Pan-India Operations',
    location: 'Field Dispatch / Kolkata',
    type: 'Full-time',
    experience: '2–5 Years',
    description: 'Direct field erection, bag filter commissioning, and 24/7 technical support for industrial clients.',
    requirements: ['Diploma/Degree in Engineering', 'Willingness to travel for field dispatch', 'Experience with VFDs and industrial sensors'],
    sort_order: 2,
    is_published: true
  },
  {
    id: 'job-3',
    title: 'SCADA & IoT Telemetry Developer',
    department: 'Digital Utilities',
    location: 'Remote / Hybrid',
    type: 'Full-time',
    experience: '3+ Years',
    description: 'Develop cloud-enabled SCADA dashboards, MQTT gateway integrations, and live data telemetry pipelines.',
    requirements: ['Proficiency in TypeScript/Node.js/React', 'Experience with Modbus RS485 and MQTT', 'Knowledge of industrial IoT protocols'],
    sort_order: 3,
    is_published: true
  },
  {
    id: 'job-4',
    title: 'Industrial Sales & Project Manager',
    department: 'Business Development',
    location: 'Kolkata / Eastern Region',
    type: 'Full-time',
    experience: '5+ Years',
    description: 'Manage enterprise B2B sales for boiler house automation, turnkey EPC projects, and spares dispatch program.',
    requirements: ['Proven B2B sales track record in industrial utilities', 'Strong network across FMCG, Agro, and Process plants'],
    sort_order: 4,
    is_published: true
  }
];

// 12. Job Applications Initial Data
const jobApplicationsData: any[] = [];

// 13. FAQs Data
const faqsData = [
  {
    id: 'faq-1',
    question: 'What industries does Antrixx Technology serve?',
    answer: 'We engineer utility and thermal solutions tailored for process industries across India, including Food Processing & FMCG, Rice & Agro Processing, Textile Processing Mills, Beverages & Bottling Plants, Pharmaceuticals, Chemical Processing, and Heavy Manufacturing.',
    category: 'General',
    sort_order: 1,
    is_published: true
  },
  {
    id: 'faq-2',
    question: 'What core solutions does Antrixx provide?',
    answer: 'Our 12 core solution verticals span Boiler House Automation & Auto Draft Control, Utility Remote Monitoring SCADA Telemetry, Pollution Control Equipment (Bag Filters, Scrubbers), Ash & Fuel Handling Systems, Steam Engineering Automation, Spares Supply, Energy Loss Diagnostics, Retrofitting, and Balance-of-Plant (BOP) Management.',
    category: 'Solutions',
    sort_order: 2,
    is_published: true
  },
  {
    id: 'faq-3',
    question: 'Do you provide on-site installation and commissioning?',
    answer: 'Yes. Antrixx delivers end-to-end turnkey project execution, including civil/structural foundation guidance, mechanical piping erection, PLC automation panel wiring, steam trials, commissioning, and operator hands-on training.',
    category: 'Services',
    sort_order: 3,
    is_published: true
  },
  {
    id: 'faq-4',
    question: 'Can you customize solutions according to our plant requirements?',
    answer: 'Absolutely. Every boiler house, furnace, and utility loop has unique operating parameters. We design custom P&ID layouts, load-cell weighing bunkers, and closed-loop VFD control panels tailored strictly to your plant fuel type, capacity, and steam load dynamics.',
    category: 'Customization',
    sort_order: 4,
    is_published: true
  },
  {
    id: 'faq-5',
    question: 'Do you provide after-sales support and emergency spares dispatch?',
    answer: 'Yes. We maintain a pan-India field dispatch program and stock critical boiler spares, Nomex filter bags, cages, dosing pumps, and steam accessories for emergency dispatch within 24 hours.',
    category: 'Support',
    sort_order: 5,
    is_published: true
  },
  {
    id: 'faq-6',
    question: 'How can I request a technical audit or project quote?',
    answer: 'You can contact our engineering team via phone at +91 9748636108 / 9477179885, email us at antrixxtechnology@gmail.com, or fill out the contact form on our website to schedule an on-site audit.',
    category: 'Contact',
    sort_order: 6,
    is_published: true
  }
];

// 14. Contact Submissions Initial Data
const contactSubmissionsData: any[] = [];

// 15. Site Settings Data
const siteSettingsData = {
  id: 'settings-1',
  phone_primary: '+91 9748636108',
  phone_secondary: '+91 9477179885',
  email: 'antrixxtechnology@gmail.com',
  address: 'Kolkata, West Bengal, India',
  business_hours: 'Mon - Sat: 9:00 AM - 7:00 PM IST',
  linkedin_url: 'https://linkedin.com/company/antrixx-technology',
  brochure_pdf_url: '/api/resources/downloads/profile-pdf',
};

// Write all JSON files
writeJson('hero.json', heroData);
writeJson('stats.json', statsData);
writeJson('solutions.json', solutionsData);
writeJson('client_logos.json', clientLogosData);
writeJson('industries.json', industriesData);
writeJson('projects.json', projectsData);
writeJson('testimonials.json', testimonialsData);
writeJson('about.json', aboutData);
writeJson('team.json', teamData);
writeJson('resources.json', resourcesData);
writeJson('job_openings.json', jobOpeningsData);
writeJson('job_applications.json', jobApplicationsData);
writeJson('faqs.json', faqsData);
writeJson('contact_submissions.json', contactSubmissionsData);
writeJson('site_settings.json', siteSettingsData);

console.log('=======================================================');
console.log('  SEED COMPLETE — Verification Metrics:');
console.log(`  - Core Solutions Extracted: ${solutionsData.length} (Expected 12)`);
console.log(`  - Enterprise Clients Extracted: ${clientLogosData.length} (Expected 10)`);
console.log(`  - Industry Verticals: ${industriesData.length}`);
console.log(`  - Case Studies: ${projectsData.length}`);
console.log('=======================================================');
