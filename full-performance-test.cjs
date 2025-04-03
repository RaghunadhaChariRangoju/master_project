// Comprehensive Performance Test for AG Handloom E-commerce
// Tests both frontend pages and API endpoints under load
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000';

// Test both pages and API endpoints
const TEST_TARGETS = [
  // Pages
  { type: 'page', path: '/', name: 'Home Page' },
  { type: 'page', path: '/products', name: 'Products Page' },
  { type: 'page', path: '/cart', name: 'Cart Page' },
  { type: 'page', path: '/about', name: 'About Page' },
  { type: 'page', path: '/login', name: 'Login Page' },
  { type: 'page', path: '/register', name: 'Register Page' },
  { type: 'page', path: '/checkout', name: 'Checkout Page' },
  
  // API endpoints (testing both JSON and HTML responses)
  { type: 'api', path: '/products', name: 'Products API', accept: 'text/html' },
  { type: 'api', path: '/api/products', name: 'Products JSON API', accept: 'application/json' },
  { type: 'api', path: '/api/cart', name: 'Cart API', accept: 'application/json' },
  { type: 'api', path: '/api/orders', name: 'Orders API', accept: 'application/json' }
];

// Test parameters
const REQUESTS_PER_TARGET = 5;
const CONCURRENT_REQUESTS = 3;
const REQUEST_TIMEOUT = 5000; // 5 seconds

// Stats tracking
const stats = {
  startTime: Date.now(),
  totalRequests: 0,
  completed: 0,
  successful: 0,
  failed: 0,
  timeouts: 0,
  targets: {}
};

// Initialize stats for each target
TEST_TARGETS.forEach(target => {
  stats.targets[target.path] = {
    name: target.name,
    type: target.type,
    requests: 0,
    successful: 0,
    failed: 0,
    timeouts: 0,
    totalTime: 0,
    minTime: Number.MAX_VALUE,
    maxTime: 0,
    totalSize: 0,
    statusCodes: {}
  };
});

const TOTAL_REQUESTS = TEST_TARGETS.length * REQUESTS_PER_TARGET;

// Make a request to a target
function makeRequest(target) {
  return new Promise(resolve => {
    const { path, name, type, accept = 'text/html' } = target;
    const startTime = Date.now();
    
    // Update stats
    stats.totalRequests++;
    stats.targets[path].requests++;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Accept': accept
      },
      timeout: REQUEST_TIMEOUT
    };
    
    const req = http.request(options, res => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const targetStats = stats.targets[path];
        
        // Update response status code count
        targetStats.statusCodes[res.statusCode] = 
          (targetStats.statusCodes[res.statusCode] || 0) + 1;
        
        // Calculate content size
        const contentLength = Buffer.byteLength(data);
        targetStats.totalSize += contentLength;
        
        // Update timing stats
        targetStats.totalTime += duration;
        targetStats.minTime = Math.min(targetStats.minTime, duration);
        targetStats.maxTime = Math.max(targetStats.maxTime, duration);
        
        // Check if request was successful
        if (res.statusCode >= 200 && res.statusCode < 400) {
          stats.successful++;
          targetStats.successful++;
          console.log(`✓ ${type.toUpperCase()} | ${name} - ${res.statusCode} (${duration}ms, ${formatSize(contentLength)})`);
        } else {
          stats.failed++;
          targetStats.failed++;
          console.log(`✗ ${type.toUpperCase()} | ${name} - ${res.statusCode} (${duration}ms)`);
        }
        
        stats.completed++;
        checkCompletion();
        resolve();
      });
    });
    
    req.on('error', err => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      const targetStats = stats.targets[path];
      
      stats.failed++;
      targetStats.failed++;
      
      if (err.code === 'ETIMEDOUT' || err.code === 'ECONNRESET') {
        stats.timeouts++;
        targetStats.timeouts++;
        console.log(`✗ ${type.toUpperCase()} | ${name} - TIMEOUT (${duration}ms)`);
      } else {
        console.log(`✗ ${type.toUpperCase()} | ${name} - ERROR: ${err.message} (${duration}ms)`);
      }
      
      stats.completed++;
      checkCompletion();
      resolve();
    });
    
    req.on('timeout', () => {
      req.destroy();
    });
    
    req.end();
  });
}

function checkCompletion() {
  if (stats.completed === TOTAL_REQUESTS) {
    printResults();
  }
}

// Helper function to format file size
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function printResults() {
  const totalDuration = Date.now() - stats.startTime;
  const throughput = (stats.completed / (totalDuration / 1000)).toFixed(2);
  
  console.log('\n============ PERFORMANCE TEST RESULTS ============');
  console.log(`Total Requests: ${stats.totalRequests}`);
  console.log(`Successful: ${stats.successful} (${((stats.successful / stats.totalRequests) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${stats.failed} (${((stats.failed / stats.totalRequests) * 100).toFixed(1)}%)`);
  console.log(`Timeouts: ${stats.timeouts}`);
  console.log(`Total Test Duration: ${(totalDuration / 1000).toFixed(2)} seconds`);
  console.log(`Throughput: ${throughput} requests/second`);
  
  // Pages section
  console.log('\n============ PAGE PERFORMANCE ============');
  console.log('Page | Requests | Success % | Avg Time | Min Time | Max Time | Avg Size');
  console.log('-----|----------|-----------|----------|----------|----------|----------');
  
  const pageTargets = TEST_TARGETS.filter(target => target.type === 'page');
  pageTargets.forEach(target => {
    const targetStats = stats.targets[target.path];
    if (targetStats.requests > 0) {
      const successRate = ((targetStats.successful / targetStats.requests) * 100).toFixed(1);
      const avgTime = (targetStats.totalTime / targetStats.requests).toFixed(1);
      const avgSize = formatSize(Math.round(targetStats.totalSize / targetStats.requests));
      
      console.log(
        `${targetStats.name.padEnd(20)} | ` +
        `${targetStats.requests.toString().padEnd(8)} | ` +
        `${successRate.padEnd(9)}% | ` +
        `${avgTime.padEnd(8)}ms | ` +
        `${targetStats.minTime.toString().padEnd(8)}ms | ` +
        `${targetStats.maxTime.toString().padEnd(8)}ms | ` +
        `${avgSize}`
      );
    }
  });
  
  // API section
  console.log('\n============ API PERFORMANCE ============');
  console.log('API Endpoint | Requests | Success % | Avg Time | Min Time | Max Time | Status Codes');
  console.log('------------|----------|-----------|----------|----------|----------|-------------');
  
  const apiTargets = TEST_TARGETS.filter(target => target.type === 'api');
  apiTargets.forEach(target => {
    const targetStats = stats.targets[target.path];
    if (targetStats.requests > 0) {
      const successRate = ((targetStats.successful / targetStats.requests) * 100).toFixed(1);
      const avgTime = (targetStats.totalTime / targetStats.requests).toFixed(1);
      const statusCodesStr = Object.entries(targetStats.statusCodes)
        .map(([code, count]) => `${code}:${count}`)
        .join(', ');
      
      console.log(
        `${targetStats.name.padEnd(20)} | ` +
        `${targetStats.requests.toString().padEnd(8)} | ` +
        `${successRate.padEnd(9)}% | ` +
        `${avgTime.padEnd(8)}ms | ` +
        `${targetStats.minTime.toString().padEnd(8)}ms | ` +
        `${targetStats.maxTime.toString().padEnd(8)}ms | ` +
        `${statusCodesStr}`
      );
    }
  });
  
  // Performance analysis
  console.log('\n============ PERFORMANCE ANALYSIS ============');
  
  // Check for slow pages
  const slowPages = Object.values(stats.targets)
    .filter(t => t.type === 'page' && t.requests > 0 && (t.totalTime / t.requests) > 200)
    .sort((a, b) => (b.totalTime / b.requests) - (a.totalTime / a.requests));
  
  if (slowPages.length > 0) {
    console.log('🔍 SLOW PAGES (avg response > 200ms):');
    slowPages.forEach(page => {
      console.log(`  - ${page.name}: ${(page.totalTime / page.requests).toFixed(1)}ms average`);
    });
  } else {
    console.log('✓ All pages load quickly (under 200ms average)');
  }
  
  // Check for failing endpoints
  const failingEndpoints = Object.values(stats.targets)
    .filter(t => t.requests > 0 && (t.failed / t.requests) > 0)
    .sort((a, b) => (b.failed / b.requests) - (a.failed / a.requests));
  
  if (failingEndpoints.length > 0) {
    console.log('\n🔍 FAILING ENDPOINTS:');
    failingEndpoints.forEach(endpoint => {
      console.log(`  - ${endpoint.name}: ${(endpoint.failed / endpoint.requests * 100).toFixed(1)}% failure rate`);
    });
  }
  
  // Overall assessment
  console.log('\n============ OVERALL ASSESSMENT ============');
  
  const overallSuccessRate = (stats.successful / stats.totalRequests) * 100;
  const avgResponseTime = stats.totalRequests > 0 ? 
    Object.values(stats.targets).reduce((sum, t) => sum + t.totalTime, 0) / stats.totalRequests : 0;
  
  if (overallSuccessRate >= 95) {
    console.log('✓ RELIABILITY: Excellent (>95% success rate)');
  } else if (overallSuccessRate >= 90) {
    console.log('✓ RELIABILITY: Good (90-95% success rate)');
  } else {
    console.log('⚠ RELIABILITY: Needs improvement (<90% success rate)');
  }
  
  if (avgResponseTime < 100) {
    console.log('✓ PERFORMANCE: Excellent (avg response <100ms)');
  } else if (avgResponseTime < 200) {
    console.log('✓ PERFORMANCE: Good (avg response 100-200ms)');
  } else {
    console.log('⚠ PERFORMANCE: Needs improvement (avg response >200ms)');
  }
  
  if (parseFloat(throughput) > 20) {
    console.log('✓ SCALABILITY: Excellent (>20 req/sec)');
  } else if (parseFloat(throughput) > 10) {
    console.log('✓ SCALABILITY: Good (10-20 req/sec)');
  } else {
    console.log('⚠ SCALABILITY: Needs improvement (<10 req/sec)');
  }
  
  process.exit(0);
}

// Function to run the performance test
async function runPerformanceTest() {
  console.log(`Starting comprehensive performance test against ${BASE_URL}`);
  console.log(`Testing ${TEST_TARGETS.length} targets with ${REQUESTS_PER_TARGET} requests each`);
  console.log(`Concurrency level: ${CONCURRENT_REQUESTS}`);
  console.log('-'.repeat(60));
  
  // Create a queue of requests to make
  const requestQueue = [];
  
  TEST_TARGETS.forEach(target => {
    for (let i = 0; i < REQUESTS_PER_TARGET; i++) {
      requestQueue.push(target);
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
        const target = requestQueue.shift();
        batch.push(makeRequest(target));
      }
      
      await Promise.all(batch);
    }
  }
  
  await processQueue();
}

// Run the performance test
runPerformanceTest();
