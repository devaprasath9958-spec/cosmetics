const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../frontend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

async function insertOrder() {
  const url = `${env.VITE_SUPABASE_URL}/rest/v1/orders`;
  const payload = {
    user_id: '00000000-0000-0000-0000-000000000000',
    status: 'Placed',
    total: 100,
    payment_method: 'Card',
    shipping_address: '123 Test St',
    payment_status: 'Success',
    razorpay_order_id: 'order_123',
    razorpay_payment_id: 'pay_123'
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
    console.log(`Insert order status: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(text);
  } catch(e) {
    console.error(e);
  }
}

insertOrder();
