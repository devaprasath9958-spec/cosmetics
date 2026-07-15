const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../frontend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

async function insertPayment() {
  const url = `${env.VITE_SUPABASE_URL}/rest/v1/payments`;
  const payload = {
    payment_method: 'Card',
    payment_status: 'Success',
    amount: 100,
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    console.log(`Insert payment status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(text);
  } catch(e) {
    console.error(e);
  }
}

insertPayment();
