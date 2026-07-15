const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../frontend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

async function fetchColumns(table) {
  const url = `${env.VITE_SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`;
  try {
    const res = await fetch(url, { headers: { 'apikey': env.VITE_SUPABASE_ANON_KEY, 'Authorization': `Bearer ${env.VITE_SUPABASE_ANON_KEY}` }});
    if (!res.ok) {
      console.error(`Failed to fetch ${table}: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.error(text);
      return;
    }
    const data = await res.json();
    if (data.length > 0) {
      console.log(`${table} columns:`, Object.keys(data[0]));
    } else {
      console.log(`${table} is empty.`);
    }
  } catch(e) {
    console.error(e);
  }
}

fetchColumns('orders').then(() => fetchColumns('payments'));
