// Comprehensive script to inspect Supabase database structure
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://okdfoduvrbhpdqqlsryh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZGZvZHV2cmJocGRxcWxzcnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MDkxNDYsImV4cCI6MjA1MTk4NTE0Nn0.qNM_6_sn7IIYXbC4ihBCxQpnmB8qeuGwz9BuGrPjPRs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Alternative approach to discover tables
async function discoverTables() {
  console.log('SUPABASE DATABASE INSPECTION');
  console.log('===========================\n');
  
  // Try to determine the schema from existing public tables
  console.log('Attempting to discover tables...');
  
  // List of potential tables to check in a Supabase project
  const potentialTables = [
    'products', 'categories', 'users', 'customers', 'profiles', 
    'orders', 'order_items', 'cart', 'cart_items', 'wishlist', 'wishlist_items',
    'addresses', 'payments', 'reviews', 'ratings', 'shipping',
    'inventory', 'variants', 'options', 'attributes', 'discounts',
    'coupons', 'tags', 'brands', 'collections', 'promotions',
    'admin_users', 'staff', 'vendors', 'suppliers', 'warehouses',
    // Auth tables
    'auth.users', 'auth.sessions', 'auth.refresh_tokens',
    // Storage tables
    'storage.buckets', 'storage.objects'
  ];
  
  const actualTables = [];
  
  for (const tableName of potentialTables) {
    try {
      // Skip schema prefixed tables for now
      if (tableName.includes('.')) continue;
      
      // Try to fetch the table info
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      // A successful query (even with empty results) means the table exists
      if (!error) {
        actualTables.push(tableName);
        console.log(`✅ Discovered table: ${tableName}`);
      }
    } catch (err) {
      // Skip errors - table likely doesn't exist
    }
  }
  
  console.log(`\nFOUND TABLES: ${actualTables.join(', ')}\n`);
  
  // Now inspect each discovered table in detail
  for (const tableName of actualTables) {
    await inspectTable(tableName);
  }
  
  // Try to fetch auth tables with service role if provided
  console.log('\nNote: Auth tables cannot be accessed with the anon key.');
}

// Function to inspect a single table in detail
async function inspectTable(tableName) {
  console.log(`\n📊 INSPECTING TABLE: ${tableName}`);
  console.log('---------------------------');
  
  try {
    // First get the count
    const { count, error: countError } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error(`Error getting count for ${tableName}:`, countError.message);
      return;
    }
    
    console.log(`Row count: ${count}`);
    
    // Get a sample row to infer the schema
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Error fetching data from ${tableName}:`, error.message);
      return;
    }
    
    if (data && data.length > 0) {
      const sampleRow = data[0];
      
      // Print the table schema (column names and types)
      console.log('\nTable Schema:');
      const columns = Object.keys(sampleRow);
      const columnInfo = columns.map(col => {
        const value = sampleRow[col];
        const type = Array.isArray(value) ? `array(${typeof value[0] || 'unknown'})` 
          : value === null ? 'null' 
          : typeof value;
        
        return `  - ${col}: ${type}`;
      });
      
      console.log(columnInfo.join('\n'));
      
      // Print a sample row
      console.log('\nSample Row:');
      console.log(JSON.stringify(sampleRow, null, 2));
      
      // If there are few rows, fetch all
      if (count <= 10) {
        console.log(`\nFetching all rows (${count} total):`);
        const { data: allData, error: allError } = await supabase
          .from(tableName)
          .select('*');
        
        if (!allError) {
          console.log(JSON.stringify(allData, null, 2));
        }
      } else {
        // Just fetch column names and first few rows
        const { data: sampleData, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(3);
          
        if (!sampleError) {
          console.log(`\nShowing 3 sample rows (${count} total):`);
          console.log(JSON.stringify(sampleData, null, 2));
        }
      }
    } else {
      console.log('Table exists but is empty');
    }
  } catch (err) {
    console.error(`Error inspecting table ${tableName}:`, err);
  }
}

// Run the discovery function
discoverTables().catch(err => {
  console.error('Error during table discovery:', err);
});
