// API Endpoint Test for AG Handloom E-commerce
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = [
  // Pages
  { path: '/', name: 'Home Page', expectedStatus: 200 },
  { path: '/products', name: 'Products Page', expectedStatus: 200 },
  { path: '/cart', name: 'Cart Page', expectedStatus: 200 },
  { path: '/about', name: 'About Page', expectedStatus: 200 },
  { path: '/login', name: 'Login Page', expectedStatus: 200 },
  
  // API endpoints
  { path: '/api/products', name: 'Products API', expectedStatus: 200 },
  { path: '/api/products/featured', name: 'Featured Products', expectedStatus: 200 },
  { path: '/api/products/1', name: 'Product Detail', expectedStatus: 200 },
  { path: '/api/cart', name: 'Cart API', expectedStatus: 200 },
  { path: '/api/orders', name: 'Orders API', expectedStatus: 200 }
];

// Test results
const results = {
  total: API_ENDPOINTS.length,
  passed: 0,
  failed: 0,
  details: []
};

// Function to test an endpoint
function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: endpoint.path,
      method: 'GET',
      timeout: 5000 // 5-second timeout
    };
    
    const req = http.request(options, (res) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Check status code
      const success = (
        endpoint.expectedStatus ? 
          res.statusCode === endpoint.expectedStatus : 
          res.statusCode >= 200 && res.statusCode < 400
      );
      
      const result = {
        name: endpoint.name,
        path: endpoint.path,
        status: res.statusCode,
        duration: duration,
        success: success
      };
      
      if (success) {
        results.passed++;
        console.log(`✅ ${endpoint.name} (${endpoint.path}): ${res.statusCode} (${duration}ms)`);
      } else {
        results.failed++;
        console.log(`❌ ${endpoint.name} (${endpoint.path}): ${res.statusCode} (${duration}ms) - Expected: ${endpoint.expectedStatus || '2xx'}`);
      }
      
      results.details.push(result);
      resolve();
    });
    
    req.on('error', (error) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      results.failed++;
      console.log(`❌ ${endpoint.name} (${endpoint.path}): ERROR - ${error.message} (${duration}ms)`);
      
      results.details.push({
        name: endpoint.name,
        path: endpoint.path,
        error: error.message,
        duration: duration,
        success: false
      });
      
      resolve();
    });
    
    req.on('timeout', () => {
      req.destroy();
    });
    
    req.end();
  });
}

// Main test function
async function runApiTests() {
  console.log(`\n🧪 TESTING ${API_ENDPOINTS.length} API ENDPOINTS 🧪`);
  console.log('===============================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('===============================================\n');
  
  // Run tests for all endpoints
  const promises = API_ENDPOINTS.map(endpoint => testEndpoint(endpoint));
  await Promise.all(promises);
  
  // Print summary
  console.log('\n===============================================');
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('===============================================');
  console.log(`Total endpoints tested: ${results.total}`);
  console.log(`✅ Passed: ${results.passed} (${(results.passed / results.total * 100).toFixed(1)}%)`);
  console.log(`❌ Failed: ${results.failed} (${(results.failed / results.total * 100).toFixed(1)}%)`);
  
  // Failed endpoints
  if (results.failed > 0) {
    console.log('\n❌ FAILED ENDPOINTS:');
    results.details
      .filter(result => !result.success)
      .forEach(result => {
        if (result.error) {
          console.log(`- ${result.name} (${result.path}): ${result.error}`);
        } else {
          console.log(`- ${result.name} (${result.path}): Got status ${result.status}`);
        }
      });
  }
  
  console.log('\n✨ API Endpoint testing completed ✨');
}

// Run the tests if server is running, otherwise print instructions
function checkServerAndRun() {
  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'HEAD',
    timeout: 3000
  }, (res) => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      runApiTests();
    } else {
      console.log('⚠️ Server is running but returned an unexpected status code:', res.statusCode);
      console.log('Please make sure the development server is running correctly with: npm run dev');
    }
  });
  
  req.on('error', () => {
    console.log('⚠️ Could not connect to the development server at http://localhost:3000');
    console.log('Please start the development server with: npm run dev');
    console.log('Then run this test script again.');
  });
  
  req.on('timeout', () => {
    req.destroy();
    console.log('⚠️ Connection to the development server timed out.');
    console.log('Please make sure the server is running at http://localhost:3000');
  });
  
  req.end();
}

// Start the tests
checkServerAndRun();
