import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const BUCKET_NAME = 'general'; // Using general bucket as per client.ts

async function migrateLogos() {
  console.log('Ensuring bucket exists...');
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === BUCKET_NAME)) {
    console.log(`Creating bucket ${BUCKET_NAME}...`);
    await supabase.storage.createBucket(BUCKET_NAME, { public: true });
  }

  const logosDir = path.join(process.cwd(), 'public', 'uploads', 'client-logos');
  const jsonPath = path.join(process.cwd(), 'data', 'client_logos.json');
  
  if (!fs.existsSync(logosDir)) {
    console.log("No local logos directory found at", logosDir);
    return;
  }

  const files = fs.readdirSync(logosDir);
  const clientLogos = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  for (const client of clientLogos) {
    if (client.logo_url && client.logo_url.startsWith('/uploads/client-logos/')) {
      const filename = path.basename(client.logo_url);
      const filePath = path.join(logosDir, filename);

      if (fs.existsSync(filePath)) {
        console.log(`Uploading ${filename} to Supabase...`);
        const fileBuffer = fs.readFileSync(filePath);
        
        // Ensure unique filename
        const ext = path.extname(filename);
        const newFilename = `${uuidv4()}${ext}`;

        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(newFilename, fileBuffer, {
            contentType: 'image/png', // assuming png for logos
            upsert: true,
          });

        if (error) {
          console.error(`Failed to upload ${filename}:`, error);
        } else {
          const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(newFilename);
          client.logo_url = publicUrlData.publicUrl;
          console.log(`Updated ${client.name} to ${client.logo_url}`);
        }
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(clientLogos, null, 2));
  console.log('Finished migrating logos! client_logos.json updated.');
}

migrateLogos();
