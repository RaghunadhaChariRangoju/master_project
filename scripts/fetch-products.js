// Script to fetch all products from Supabase
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://okdfoduvrbhpdqqlsryh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZGZvZHV2cmJocGRxcWxzcnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MDkxNDYsImV4cCI6MjA1MTk4NTE0Nn0.qNM_6_sn7IIYXbC4ihBCxQpnmB8qeuGwz9BuGrPjPRs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAllProducts() {
  console.log('Fetching all products from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    
    console.log(`Found ${data.length} products:`);
    
    // Display each product with key details
    data.forEach((product, index) => {
      console.log(`\n--- Product ${index + 1} ---`);
      console.log(`ID: ${product.id}`);
      console.log(`Name: ${product.name}`);
      console.log(`Price: ₹${product.price}`);
      console.log(`Category: ${product.category}`);
      console.log(`Stock: ${product.stock_quantity}`);
      console.log(`Images: ${product.images ? product.images.join(', ') : 'None'}`);
    });
  } catch (err) {
    console.error('Error fetching products:', err);
  }
}

// Also fetch profiles to understand user data
async function fetchProfiles() {
  console.log('\n\nFetching all profiles from Supabase...');
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }
    
    console.log(`Found ${data.length} profiles:`);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching profiles:', err);
  }
}

// Execute functions
fetchAllProducts()
  .then(() => fetchProfiles())
  .catch(console.error);
