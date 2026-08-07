import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function readJson(filename) {
    try {
        const data = fs.readFileSync(path.join(process.cwd(), 'data', filename), 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return null;
    }
}

async function run() {
    console.log('Seeding Supabase without string IDs...');
    
    const tables = [
        { file: 'hero.json', table: 'hero', isArray: false },
        { file: 'stats.json', table: 'stats', isArray: true },
        { file: 'solutions.json', table: 'solutions', isArray: true },
        { file: 'industries.json', table: 'industries', isArray: true },
        { file: 'projects.json', table: 'projects', isArray: true },
        { file: 'client_logos.json', table: 'client_logos', isArray: true },
    ];

    for (const t of tables) {
        let data = readJson(t.file);
        if (!data) continue;
        
        if (t.isArray) {
            data = data.map(d => {
                delete d.id;
                return d;
            });
            const { error } = await supabase.from(t.table).insert(data);
            if (error) console.error(`Error inserting ${t.table}:`, error.message);
            else console.log(`Inserted ${data.length} rows into ${t.table}`);
        } else {
            delete data.id;
            const { error } = await supabase.from(t.table).insert(data);
            if (error) console.error(`Error inserting ${t.table}:`, error.message);
            else console.log(`Inserted row into ${t.table}`);
        }
    }
    
    console.log('Done!');
}
run();
