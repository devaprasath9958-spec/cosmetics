const fs = require('fs');
const path = require('path');

// Read frontend .env manually to avoid dotenv dependency
const envPath = path.join(__dirname, '../frontend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    env[key.trim()] = value.trim();
  }
});

const url = `${env.VITE_SUPABASE_URL}/rest/v1/orders?select=*&limit=1`;
const headers = {
  'apikey': env.VITE_SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
};

fetch(url, { headers })
  .then(res => res.json())
  .then(data => {
    console.log('Orders columns:', data.length > 0 ? Object.keys(data[0]) : 'Empty table');
  })
  .catch(err => console.error(err));
