const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../backend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});
const frontendEnvPath = path.join(__dirname, '../frontend/.env');
const frontendEnvContent = fs.readFileSync(frontendEnvPath, 'utf8');
frontendEnvContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value && !env[key.trim()]) env[key.trim()] = value.trim();
});

const url = `${env.VITE_SUPABASE_URL}/rest/v1/?apikey=${env.SUPABASE_SERVICE_ROLE_KEY}`;
fetch(url)
  .then(res => res.json())
  .then(data => {
    fs.writeFileSync('scratch/swagger.json', JSON.stringify(data, null, 2));
    console.log('Saved swagger.json');
  })
  .catch(err => console.error(err));
