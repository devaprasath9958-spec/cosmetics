const https = require('https');

const data = JSON.stringify({ amount: 50000, currency: 'INR' });

const options = {
  hostname: 'backend-for-lume.onrender.com',
  port: 443,
  path: '/api/payment/create-order',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
  },
};

const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
