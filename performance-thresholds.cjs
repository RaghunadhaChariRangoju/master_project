// Performance Thresholds and Load Testing for AG Handloom E-commerce
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { performance } = require('perf_hooks');

// Configuration
const BASE_URL = 'http://localhost:3001'; // Change this to your development server URL
const REQUEST_TIMEOUT = 10000; // 10 seconds
const CONCURRENT_REQUESTS = 20; // Number of concurrent requests per endpoint
const REQUEST_BATCHES = 5; // Number of request batches to send
const BATCH_DELAY = 1000; // Delay between batches (ms)

// Performance thresholds (adjust these based on your requirements)
const THRESHOLDS = {
  // API Response Time Thresholds (ms)
  API_RESPONSE: {
    OPTIMAL: 200,    // Under 200ms is optimal
    ACCEPTABLE: 500, // Under 500ms is acceptable
    DEGRADED: 1000,  // Under 1000ms is degraded
    CRITICAL: 2000   // Over 2000ms is critical/failing
  },
  
  // Page Load Time Thresholds (ms)
  PAGE_LOAD: {
    OPTIMAL: 1000,    // Under 1s is optimal
    ACCEPTABLE: 2000, // Under 2s is acceptable
    DEGRADED: 3000,   // Under 3s is degraded
    CRITICAL: 5000    // Over 5s is critical/failing
  },
  
  // Server Resource Thresholds
  SERVER_RESOURCES: {
    MAX_CONCURRENT_USERS: 100,  // Expected maximum concurrent users
    MEMORY_USAGE_MB: 500,       // Max memory usage before performance suffers
    CPU_USAGE_PERCENT: 80       // Max CPU usage before performance suffers
  },
  
  // Client Resource Thresholds
  CLIENT_RESOURCES: {
    BUNDLE_SIZE_KB: 2000,       // Maximum acceptable bundle size in KB
    RENDER_TIME_MS: 100,        // Maximum acceptable initial render time
    TOTAL_DOM_NODES: 1500       // Maximum DOM nodes before performance degrades
  }
};

// Test results storage
const results = {
  endpoints: {},
  pages: {},
  serverMetrics: {},
  clientMetrics: {},
  summary: {
    totalRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: Number.MAX_SAFE_INTEGER
  }
};

// List of API endpoints to test
const API_ENDPOINTS = [
  '/api/products',
  '/api/products/featured',
  '/api/categories',
  '/api/cart',
  '/api/checkout',
  '/api/user/profile'
];

// List of pages to test
const PAGES = [
  '/',                  // Home page
  '/products',          // Product listing
  '/products/1',        // Single product
  '/cart',              // Cart page
  '/checkout',          // Checkout page
  '/profile'            // User profile
];

// Helper function to make a single HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    const options = {
      timeout: REQUEST_TIMEOUT
    };
    
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = performance.now();
        resolve({
          url,
          statusCode: res.statusCode,
          responseTime: endTime - startTime,
          data: data.length,
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });
    
    req.on('error', (error) => {
      const endTime = performance.now();
      reject({
        url,
        error: error.message,
        responseTime: endTime - startTime,
        success: false
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      const endTime = performance.now();
      reject({
        url,
        error: 'Request timed out',
        responseTime: endTime - startTime,
        success: false
      });
    });
  });
}

// Make multiple concurrent requests to an endpoint
async function loadTestEndpoint(endpoint) {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  console.log(`Load testing ${url} with ${CONCURRENT_REQUESTS} concurrent requests × ${REQUEST_BATCHES} batches`);
  
  results.endpoints[endpoint] = {
    url,
    requests: 0,
    failures: 0,
    totalTime: 0,
    maxTime: 0,
    minTime: Number.MAX_SAFE_INTEGER,
    responseStatus: {},
    performanceCategory: 'OPTIMAL'
  };
  
  for (let batch = 0; batch < REQUEST_BATCHES; batch++) {
    const requests = [];
    
    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
      requests.push(makeRequest(url));
    }
    
    try {
      const responses = await Promise.allSettled(requests);
      
      for (const response of responses) {
        results.summary.totalRequests++;
        results.endpoints[endpoint].requests++;
        
        if (response.status === 'fulfilled') {
          const result = response.value;
          const responseTime = result.responseTime;
          
          // Update endpoint stats
          results.endpoints[endpoint].totalTime += responseTime;
          results.endpoints[endpoint].maxTime = Math.max(results.endpoints[endpoint].maxTime, responseTime);
          results.endpoints[endpoint].minTime = Math.min(results.endpoints[endpoint].minTime, responseTime);
          
          // Update status code tracking
          const status = result.statusCode.toString();
          results.endpoints[endpoint].responseStatus[status] = 
            (results.endpoints[endpoint].responseStatus[status] || 0) + 1;
          
          // Update global stats
          results.summary.avgResponseTime += responseTime;
          results.summary.maxResponseTime = Math.max(results.summary.maxResponseTime, responseTime);
          results.summary.minResponseTime = Math.min(results.summary.minResponseTime, responseTime);
          
          if (!result.success) {
            results.summary.failedRequests++;
            results.endpoints[endpoint].failures++;
          }
        } else {
          results.summary.failedRequests++;
          results.endpoints[endpoint].failures++;
          results.endpoints[endpoint].responseStatus['error'] = 
            (results.endpoints[endpoint].responseStatus['error'] || 0) + 1;
          
          // Still track response time for errors when available
          if (response.reason && response.reason.responseTime) {
            const errorTime = response.reason.responseTime;
            results.endpoints[endpoint].totalTime += errorTime;
            results.endpoints[endpoint].maxTime = Math.max(results.endpoints[endpoint].maxTime, errorTime);
          }
        }
      }
    } catch (error) {
      console.error(`Batch ${batch + 1} failed:`, error);
    }
    
    // Add delay between batches
    if (batch < REQUEST_BATCHES - 1) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
  }
  
  // Calculate average response time for the endpoint
  const avgTime = results.endpoints[endpoint].totalTime / results.endpoints[endpoint].requests;
  results.endpoints[endpoint].avgTime = avgTime;
  
  // Determine performance category based on thresholds
  if (avgTime <= THRESHOLDS.API_RESPONSE.OPTIMAL) {
    results.endpoints[endpoint].performanceCategory = 'OPTIMAL';
  } else if (avgTime <= THRESHOLDS.API_RESPONSE.ACCEPTABLE) {
    results.endpoints[endpoint].performanceCategory = 'ACCEPTABLE';
  } else if (avgTime <= THRESHOLDS.API_RESPONSE.DEGRADED) {
    results.endpoints[endpoint].performanceCategory = 'DEGRADED';
  } else {
    results.endpoints[endpoint].performanceCategory = 'CRITICAL';
  }
  
  console.log(`  Completed: ${results.endpoints[endpoint].requests} requests, ` + 
    `Avg time: ${avgTime.toFixed(2)}ms, ` +
    `Max time: ${results.endpoints[endpoint].maxTime.toFixed(2)}ms, ` +
    `Category: ${results.endpoints[endpoint].performanceCategory}`);
}

// Test server resource usage
function testServerResources() {
  try {
    console.log('Measuring server resource usage...');
    
    // Basic OS stats (this is a simplified version - in real-world scenarios,
    // you would use more sophisticated monitoring)
    const memoryUsage = process.memoryUsage();
    const heapUsed = memoryUsage.heapUsed / 1024 / 1024; // Convert to MB
    
    results.serverMetrics = {
      memoryUsageMB: heapUsed.toFixed(2),
      estimatedConcurrentUsers: estimateConcurrentUsers(results.summary.avgResponseTime),
      memoryStatus: heapUsed < THRESHOLDS.SERVER_RESOURCES.MEMORY_USAGE_MB ? 'OK' : 'WARNING'
    };
    
    console.log(`  Memory Usage: ${results.serverMetrics.memoryUsageMB} MB`);
    console.log(`  Estimated Max Concurrent Users: ${results.serverMetrics.estimatedConcurrentUsers}`);
  } catch (error) {
    console.error('Error measuring server resources:', error);
  }
}

// Get client-side bundle size metrics
function analyzeClientResources() {
  try {
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
      console.log('No dist directory found. Run a production build first.');
      return;
    }
    
    // Calculate JS bundle size
    const assetsPath = path.join(distPath, 'assets');
    let totalJsSize = 0;
    let largestJsFile = { size: 0, name: '' };
    
    function processDirectory(dirPath) {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          processDirectory(filePath);
        } else if (file.endsWith('.js')) {
          if (stats.size > largestJsFile.size) {
            largestJsFile = { size: stats.size, name: file };
          }
          totalJsSize += stats.size;
        }
      }
    }
    
    if (fs.existsSync(assetsPath)) {
      processDirectory(assetsPath);
    }
    
    // Convert to KB
    const totalJsSizeKB = totalJsSize / 1024;
    const largestJsSizeKB = largestJsFile.size / 1024;
    
    results.clientMetrics = {
      totalJsBundleSizeKB: totalJsSizeKB.toFixed(2),
      largestJsFileKB: largestJsSizeKB.toFixed(2),
      largestJsFileName: largestJsFile.name,
      bundleStatus: totalJsSizeKB < THRESHOLDS.CLIENT_RESOURCES.BUNDLE_SIZE_KB ? 'OK' : 'WARNING'
    };
    
    console.log('Analyzing client-side resources...');
    console.log(`  Total JS Bundle Size: ${results.clientMetrics.totalJsBundleSizeKB} KB`);
    console.log(`  Largest JS File: ${results.clientMetrics.largestJsFileName} (${results.clientMetrics.largestJsFileKB} KB)`);
    console.log(`  Bundle Size Status: ${results.clientMetrics.bundleStatus}`);
  } catch (error) {
    console.error('Error analyzing client resources:', error);
  }
}

// Helper function to estimate max concurrent users based on response time
function estimateConcurrentUsers(avgResponseTime) {
  // This is a simplified estimation. In real-world, you would need load testing with
  // gradually increasing concurrent users to find the actual breaking point.
  
  // Formula: Base capacity divided by response time factor
  // Lower response time = higher capacity
  const baseCapacity = THRESHOLDS.SERVER_RESOURCES.MAX_CONCURRENT_USERS;
  const responseFactor = Math.max(1, avgResponseTime / THRESHOLDS.API_RESPONSE.ACCEPTABLE);
  
  return Math.floor(baseCapacity / responseFactor);
}

// Format test results as a report
function generateReport() {
  // Calculate overall average response time
  if (results.summary.totalRequests > 0) {
    results.summary.avgResponseTime = results.summary.avgResponseTime / results.summary.totalRequests;
  }
  
  // Calculate overall performance category
  let performanceCategory = 'OPTIMAL';
  if (results.summary.avgResponseTime > THRESHOLDS.API_RESPONSE.OPTIMAL) {
    performanceCategory = 'ACCEPTABLE';
  }
  if (results.summary.avgResponseTime > THRESHOLDS.API_RESPONSE.ACCEPTABLE) {
    performanceCategory = 'DEGRADED';
  }
  if (results.summary.avgResponseTime > THRESHOLDS.API_RESPONSE.DEGRADED) {
    performanceCategory = 'CRITICAL';
  }
  
  // Find critical endpoints
  const criticalEndpoints = Object.entries(results.endpoints)
    .filter(([_, data]) => data.performanceCategory === 'CRITICAL')
    .map(([endpoint, _]) => endpoint);
  
  // Find slow endpoints
  const slowEndpoints = Object.entries(results.endpoints)
    .filter(([_, data]) => data.performanceCategory === 'DEGRADED')
    .map(([endpoint, _]) => endpoint);
  
  // Determine potential failure points
  const failurePoints = [];
  
  if (criticalEndpoints.length > 0) {
    failurePoints.push(`Critical response times on endpoints: ${criticalEndpoints.join(', ')}`);
  }
  
  if (slowEndpoints.length > 0) {
    failurePoints.push(`Degraded response times on endpoints: ${slowEndpoints.join(', ')}`);
  }
  
  if (results.clientMetrics.bundleStatus === 'WARNING') {
    failurePoints.push(`JavaScript bundle size exceeds recommended threshold (${THRESHOLDS.CLIENT_RESOURCES.BUNDLE_SIZE_KB}KB)`);
  }
  
  if (results.serverMetrics.memoryStatus === 'WARNING') {
    failurePoints.push(`Memory usage approaching limits (${results.serverMetrics.memoryUsageMB}MB)`);
  }
  
  if (results.serverMetrics.estimatedConcurrentUsers < THRESHOLDS.SERVER_RESOURCES.MAX_CONCURRENT_USERS) {
    failurePoints.push(`Maximum concurrent users might be limited to ~${results.serverMetrics.estimatedConcurrentUsers} users`);
  }
  
  // Compile the full report
  console.log('\n');
  console.log('=================================================');
  console.log('📊 PERFORMANCE TEST REPORT');
  console.log('=================================================');
  console.log(`Total Requests: ${results.summary.totalRequests}`);
  console.log(`Failed Requests: ${results.summary.failedRequests}`);
  console.log(`Average Response Time: ${results.summary.avgResponseTime.toFixed(2)}ms`);
  console.log(`Min Response Time: ${results.summary.minResponseTime.toFixed(2)}ms`);
  console.log(`Max Response Time: ${results.summary.maxResponseTime.toFixed(2)}ms`);
  console.log(`Overall Performance: ${performanceCategory}`);
  
  console.log('\n');
  console.log('ENDPOINT PERFORMANCE:');
  console.log('--------------------------------------------------');
  Object.entries(results.endpoints).forEach(([endpoint, data]) => {
    console.log(`${endpoint}: ${data.avgTime.toFixed(2)}ms (${data.performanceCategory})`);
  });
  
  console.log('\n');
  console.log('CLIENT RESOURCES:');
  console.log('--------------------------------------------------');
  console.log(`JS Bundle Size: ${results.clientMetrics.totalJsBundleSizeKB}KB (Threshold: ${THRESHOLDS.CLIENT_RESOURCES.BUNDLE_SIZE_KB}KB)`);
  console.log(`Largest JS File: ${results.clientMetrics.largestJsFileName} (${results.clientMetrics.largestJsFileKB}KB)`);
  
  console.log('\n');
  console.log('SERVER RESOURCES:');
  console.log('--------------------------------------------------');
  console.log(`Memory Usage: ${results.serverMetrics.memoryUsageMB}MB (Threshold: ${THRESHOLDS.SERVER_RESOURCES.MEMORY_USAGE_MB}MB)`);
  console.log(`Estimated Concurrent Users: ${results.serverMetrics.estimatedConcurrentUsers} (Target: ${THRESHOLDS.SERVER_RESOURCES.MAX_CONCURRENT_USERS})`);
  
  console.log('\n');
  console.log('🚨 PERFORMANCE THRESHOLDS AND FAILURE POINTS:');
  console.log('--------------------------------------------------');
  console.log('API Response Time Thresholds:');
  console.log(`  - Optimal: Under ${THRESHOLDS.API_RESPONSE.OPTIMAL}ms`);
  console.log(`  - Acceptable: Under ${THRESHOLDS.API_RESPONSE.ACCEPTABLE}ms`);
  console.log(`  - Degraded: Under ${THRESHOLDS.API_RESPONSE.DEGRADED}ms`);
  console.log(`  - Critical/Failing: Over ${THRESHOLDS.API_RESPONSE.CRITICAL}ms`);
  
  console.log('\nPage Load Time Thresholds:');
  console.log(`  - Optimal: Under ${THRESHOLDS.PAGE_LOAD.OPTIMAL}ms`);
  console.log(`  - Acceptable: Under ${THRESHOLDS.PAGE_LOAD.ACCEPTABLE}ms`);
  console.log(`  - Degraded: Under ${THRESHOLDS.PAGE_LOAD.DEGRADED}ms`);
  console.log(`  - Critical/Failing: Over ${THRESHOLDS.PAGE_LOAD.CRITICAL}ms`);
  
  console.log('\nResource Thresholds:');
  console.log(`  - Max Concurrent Users: ${THRESHOLDS.SERVER_RESOURCES.MAX_CONCURRENT_USERS} users`);
  console.log(`  - Memory Usage: ${THRESHOLDS.SERVER_RESOURCES.MEMORY_USAGE_MB}MB`);
  console.log(`  - CPU Usage: ${THRESHOLDS.SERVER_RESOURCES.CPU_USAGE_PERCENT}%`);
  console.log(`  - Bundle Size: ${THRESHOLDS.CLIENT_RESOURCES.BUNDLE_SIZE_KB}KB`);
  
  console.log('\nPotential Failure Points:');
  if (failurePoints.length === 0) {
    console.log('  ✅ No critical failure points detected');
  } else {
    failurePoints.forEach((point, index) => {
      console.log(`  ${index + 1}. ${point}`);
    });
  }
  
  console.log('\n');
  console.log('PERFORMANCE RECOMMENDATIONS:');
  console.log('--------------------------------------------------');
  
  const recommendations = [];
  
  if (criticalEndpoints.length > 0) {
    recommendations.push('Optimize critical endpoints with slow response times');
  }
  
  if (results.clientMetrics.bundleStatus === 'WARNING') {
    recommendations.push('Reduce JavaScript bundle size through code splitting or removing unused dependencies');
  }
  
  if (results.serverMetrics.estimatedConcurrentUsers < THRESHOLDS.SERVER_RESOURCES.MAX_CONCURRENT_USERS) {
    recommendations.push('Improve server capacity to handle target concurrent user load');
  }
  
  if (recommendations.length === 0) {
    console.log('  ✅ Application is performing within acceptable thresholds');
  } else {
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }
  
  console.log('\n=================================================');
  
  // Save report to file
  const reportData = {
    summary: results.summary,
    endpoints: results.endpoints,
    clientMetrics: results.clientMetrics,
    serverMetrics: results.serverMetrics,
    thresholds: THRESHOLDS,
    failurePoints,
    recommendations,
    timestamp: new Date().toISOString()
  };
  
  try {
    fs.writeFileSync(
      path.join(__dirname, 'performance-report.json'),
      JSON.stringify(reportData, null, 2)
    );
    console.log('📝 Report saved to performance-report.json');
  } catch (error) {
    console.error('Error saving report:', error);
  }
}

// Main function to run all tests
async function runPerformanceTests() {
  console.log('\n🧪 PERFORMANCE AND LOAD TESTING 🧪');
  console.log('=================================================');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Concurrent Requests: ${CONCURRENT_REQUESTS}`);
  console.log(`Request Batches: ${REQUEST_BATCHES}`);
  console.log('=================================================\n');
  
  // Start the development server if it's not running
  let serverStarted = false;
  try {
    // Check if server is running by making a test request
    await makeRequest(BASE_URL);
    console.log('Development server is already running.');
  } catch (error) {
    console.log('Starting development server...');
    try {
      // Start server in background (Windows command)
      execSync('start cmd /c "npm run dev"', { stdio: 'ignore' });
      serverStarted = true;
      
      // Wait for server to start
      console.log('Waiting for server to start...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (startError) {
      console.error('Failed to start development server:', startError);
      return;
    }
  }
  
  // 1. Test API endpoints
  console.log('\nTesting API endpoints...');
  for (const endpoint of API_ENDPOINTS) {
    await loadTestEndpoint(endpoint);
  }
  
  // 2. Test pages
  console.log('\nTesting pages...');
  for (const page of PAGES) {
    await loadTestEndpoint(page);
  }
  
  // 3. Test server resources
  testServerResources();
  
  // 4. Analyze client resources
  analyzeClientResources();
  
  // 5. Generate performance report
  generateReport();
  
  // If we started the server, we should offer to stop it
  if (serverStarted) {
    console.log('\nDevelopment server was started for testing.');
    // In a real implementation, we would ask if the user wants to stop the server
  }
}

// Run the performance tests
runPerformanceTests();
