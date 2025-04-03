// Temporary script to check Supabase database structure
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://okdfoduvrbhpdqqlsryh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rZGZvZHV2cmJocGRxcWxzcnloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MDkxNDYsImV4cCI6MjA1MTk4NTE0Nn0.qNM_6_sn7IIYXbC4ihBCxQpnmB8qeuGwz9BuGrPjPRs';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// List of common table names to check in an e-commerce application
const commonTableNames = [
  'products',
  'categories',
  'users',
  'orders',
  'order_items',
  'cart_items',
  'wishlist_items',
  'addresses',
  'reviews',
  'payments',
  'shipping',
  'inventory',
  'profiles',
  'customers',
  'admin_users',
  'vendors',
  'brands',
  'collections'
];

// Function to check all common tables
async function checkCommonTables() {
  console.log('Checking for common e-commerce tables in your Supabase database...');
  
  let foundTables = [];
  
  for (const tableName of commonTableNames) {
    const result = await checkTable(tableName);
    if (result.exists) {
      foundTables.push(tableName);
    }
  }
  
  console.log('\nSummary of found tables:');
  if (foundTables.length === 0) {
    console.log('No tables found. Your Supabase database might be empty or the tables have different names.');
  } else {
    console.log('Found tables:', foundTables);
  }
}

// Function to check if a table exists and describe it
async function checkTable(tableName) {
  console.log(`\nChecking for table: ${tableName}`);
  
  try {
    // Try to get a sample row to check if the table exists
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      // If we get a specific error about the relation not existing, the table doesn't exist
      if (error.code === '42P01') {
        console.log(`Table ${tableName} does not exist.`);
        return { exists: false };
      } else {
        // For other errors, like permission issues
        console.error(`Error accessing table ${tableName}:`, error.message);
        return { exists: false, error };
      }
    }
    
    console.log(`Table ${tableName} exists!`);
    
    // Get the structure from the first row
    if (data && data.length > 0) {
      console.log(`Table structure for ${tableName}:`);
      console.log(Object.keys(data[0]));
      console.log('Sample row:');
      console.log(data[0]);
      
      // Try to get the count of rows
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (!countError) {
        console.log(`Total rows: ${count}`);
      }
    } else {
      console.log(`Table ${tableName} is empty.`);
    }
    
    return { exists: true, columns: data && data.length > 0 ? Object.keys(data[0]) : [] };
  } catch (err) {
    console.error(`Error checking table ${tableName}:`, err);
    return { exists: false, error: err };
  }
}

// Start checking tables
checkCommonTables();
