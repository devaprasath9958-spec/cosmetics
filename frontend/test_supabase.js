import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkTables() {
  const tables = ['products', 'categories', 'brands', 'reviews', 'offers', 'collections', 'orders', 'customers', 'contact_enquiries', 'cart', 'wishlist'];
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table '${table}' error: ${error.message}`);
    } else {
      console.log(`Table '${table}' exists. Columns: ${data.length > 0 ? Object.keys(data[0]).join(', ') : 'Empty but exists'}`);
    }
  }
}

checkTables();
