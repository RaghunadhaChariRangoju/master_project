// API Stress Test Script (CommonJS format)
const http = require('http');
const https = require('https');

// Configuration
const BASE_URL = 'http://localhost:3000';
const API_ENDPOINTS = [
  // Product API endpoints
  { path: '/api/products', method: 'GET', name: 'Get All Products' },
  { path: '/api/products/featured', method: 'GET', name: 'Get Featured Products' },
  { path: '/api/products/categories', method: 'GET', name: 'Get Product Categories' },
  { path: '/api/products/1', method: 'GET', name: 'Get Product by ID' },
  
  // User/Auth API endpoints
  { path: '/api/auth/session', method: 'GET', name: 'Get Session' },
  
  // Cart/Order API endpoints
  { path: '/api/cart', method: 'GET', name: 'Get Cart' },
  { path: '/api/orders', method: 'GET', name: 'Get Orders' },
  
  // Other endpoints
  { path: '/api/settings', method: 'GET', name: 'Get Settings' }
];

const NUM_REQUESTS_PER_ENDPOINT = 5;
const CONCURRENT_REQUESTS = 3;

// Stats tracking
const stats = {
  totalRequests: 0,
  completed: 0,
  successful: 0,
  failed: 0,
  timeouts: 0,
  startTime: Date.now(),
  endpoints: {}
};

// Initialize endpoint stats
API_ENDPOINTS.forEach(endpoint => {
  stats.endpoints[endpoint.path] = {
    name: endpoint.name,
    requests: 0,
    successful: 0,
    failed: 0,
    totalTime: 0,
    minTime: Number.MAX_VALUE,
    maxTime: 0
  };
});

// Total number of requests to make
const TOTAL_REQUESTS = API_ENDPOINTS.length * NUM_REQUESTS_PER_ENDPOINT;

// Function to make an API request
function makeRequest(endpoint) {
  return new Promise((resolve) => {
    const { path, method } = endpoint;
    const startTime = Date.now();
    
    // Update stats
    stats.totalRequests++;
    stats.endpoints[path].requests++;
    
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 5000 // 5 second timeout
    };
    
    // Choose http or https based on protocol
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const endpointStats = stats.endpoints[path];
        
        // Update timing stats
        endpointStats.totalTime += duration;
        endpointStats.minTime = Math.min(endpointStats.minTime, duration);
        endpointStats.maxTime = Math.max(endpointStats.maxTime, duration);
        
        // Check if request was successful (2xx status code)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          stats.successful++;
          endpointStats.successful++;
          console.log(`✓ ${method} ${path} - ${res.statusCode} (${duration}ms)`);
        } else {
          stats.failed++;
          endpointStats.failed++;
          console.log(`✗ ${method} ${path} - ${res.statusCode} (${duration}ms)`);
        }
        
        stats.completed++;
        
        // If all requests are done, print summary
        if (stats.completed === TOTAL_REQUESTS) {
          printSummary();
        }
        
        resolve();
      });
    });
    
    req.on('error', (err) => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      stats.failed++;
      stats.endpoints[path].failed++;
      
      if (err.code === 'ETIMEDOUT') {
        stats.timeouts++;
        console.log(`✗ ${method} ${path} - TIMEOUT (${duration}ms)`);
      } else {
        console.log(`✗ ${method} ${path} - ERROR: ${err.message} (${duration}ms)`);
      }
      
      stats.completed++;
      
      // If all requests are done, print summary
      if (stats.completed === TOTAL_REQUESTS) {
        printSummary();
      }
      
      resolve();
    });
    
    req.on('timeout', () => {
      req.abort();
    });
    
    req.end();
  });
}

// Function to print test summary
function printSummary() {
  const totalDuration = Date.now() - stats.startTime;
  const throughput = (stats.completed / (totalDuration / 1000)).toFixed(2);
  
  console.log('\n========== API STRESS TEST SUMMARY ==========');
  console.log(`Total Requests: ${stats.totalRequests}`);
  console.log(`Successful: ${stats.successful} (${((stats.successful / stats.totalRequests) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${stats.failed} (${((stats.failed / stats.totalRequests) * 100).toFixed(1)}%)`);
  console.log(`Timeouts: ${stats.timeouts}`);
  console.log(`Total Test Duration: ${(totalDuration / 1000).toFixed(2)} seconds`);
  console.log(`Throughput: ${throughput} requests/second`);
  
  console.log('\n========== ENDPOINT PERFORMANCE ==========');
  console.log('Endpoint | Requests | Success Rate | Avg Time | Min Time | Max Time');
  console.log('---------|----------|--------------|----------|----------|----------');
  
  Object.keys(stats.endpoints).forEach(path => {
    const endpoint = stats.endpoints[path];
    
    if (endpoint.requests > 0) {
      const successRate = ((endpoint.successful / endpoint.requests) * 100).toFixed(1);
      const avgTime = (endpoint.totalTime / endpoint.requests).toFixed(1);
      
      console.log(
        `${endpoint.name.padEnd(20)} | ` +
        `${endpoint.requests.toString().padEnd(8)} | ` +
        `${successRate.padEnd(12)}% | ` +
        `${avgTime.padEnd(8)}ms | ` +
        `${endpoint.minTime.toString().padEnd(8)}ms | ` +
        `${endpoint.maxTime.toString().padEnd(8)}ms`
      );
    }
  });
  
  // Exit process
  process.exit(0);
}

// Function to run the stress test
async function runStressTest() {
  console.log(`Starting API stress test against ${BASE_URL}`);
  console.log(`Testing ${API_ENDPOINTS.length} endpoints with ${NUM_REQUESTS_PER_ENDPOINT} requests each`);
  console.log(`Concurrency level: ${CONCURRENT_REQUESTS}`);
  console.log('-'.repeat(60));
  
  // Create a queue of requests to make
  const requestQueue = [];
  
  API_ENDPOINTS.forEach(endpoint => {
    for (let i = 0; i < NUM_REQUESTS_PER_ENDPOINT; i++) {
      requestQueue.push(endpoint);
    }
  });
  
  // Shuffle the queue to randomize request order
  for (let i = requestQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [requestQueue[i], requestQueue[j]] = [requestQueue[j], requestQueue[i]];
  }
  
  // Process the queue with concurrency limit
  async function processQueue() {
    while (requestQueue.length > 0) {
      const concurrent = Math.min(CONCURRENT_REQUESTS, requestQueue.length);
      const batch = [];
      
      for (let i = 0; i < concurrent; i++) {
        const endpoint = requestQueue.shift();
        batch.push(makeRequest(endpoint));
      }
      
      await Promise.all(batch);
    }
  }
  
  await processQueue();
}

// Run the stress test
runStressTest();
