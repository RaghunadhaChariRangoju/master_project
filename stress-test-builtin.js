// Stress test using only Node.js built-in modules
// No external dependencies required

const http = require('http');
const { performance } = require('perf_hooks');

// Configuration
const TARGET_HOST = 'localhost';
const TARGET_PORT = 3000;
const PATHS = ['/', '/products', '/cart', '/about'];
const NUM_REQUESTS = 50;
const CONCURRENCY = 5;

// Metrics
let completed = 0;
let successful = 0;
let failed = 0;
let totalTime = 0;
let minTime = Number.MAX_VALUE;
let maxTime = 0;
let startTime = performance.now();

console.log(`Starting stress test for http://${TARGET_HOST}:${TARGET_PORT}`);
console.log(`Making ${NUM_REQUESTS} total requests with ${CONCURRENCY} concurrent requests`);
console.log('----------------------------------------');

function makeRequest() {
  if (completed >= NUM_REQUESTS) return;
  
  const path = PATHS[Math.floor(Math.random() * PATHS.length)];
  const requestStart = performance.now();
  
  const options = {
    hostname: TARGET_HOST,
    port: TARGET_PORT,
    path: path,
    method: 'GET'
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const requestTime = performance.now() - requestStart;
      
      // Update metrics
      totalTime += requestTime;
      minTime = Math.min(minTime, requestTime);
      maxTime = Math.max(maxTime, requestTime);
      
      if (res.statusCode >= 200 && res.statusCode < 400) {
        successful++;
        console.log(` ${res.statusCode} ${path} (${requestTime.toFixed(1)}ms)`);
      } else {
        failed++;
        console.log(` ${res.statusCode} ${path} (${requestTime.toFixed(1)}ms)`);
      }
      
      completed++;
      
      // Start next request if we haven't reached the limit
      if (completed < NUM_REQUESTS) {
        makeRequest();
      } else if (completed === NUM_REQUESTS) {
        // All requests completed, show results
        printResults();
      }
    });
  });
  
  req.on('error', (error) => {
    failed++;
    console.log(` ERROR ${path}: ${error.message}`);
    
    completed++;
    
    // Start next request if we haven't reached the limit
    if (completed < NUM_REQUESTS) {
      makeRequest();
    } else if (completed === NUM_REQUESTS) {
      // All requests completed, show results
      printResults();
    }
  });
  
  req.end();
}

function printResults() {
  const totalTestTime = performance.now() - startTime;
  
  console.log('----------------------------------------');
  console.log('STRESS TEST RESULTS:');
  console.log('----------------------------------------');
  console.log(`Total Requests:     ${NUM_REQUESTS}`);
  console.log(`Successful:         ${successful}`);
  console.log(`Failed:             ${failed}`);
  console.log(`Success Rate:       ${(successful / NUM_REQUESTS * 100).toFixed(1)}%`);
  console.log('----------------------------------------');
  console.log(`Total Test Time:    ${totalTestTime.toFixed(1)}ms`);
  console.log(`Avg Response Time:  ${(totalTime / NUM_REQUESTS).toFixed(1)}ms`);
  console.log(`Min Response Time:  ${minTime.toFixed(1)}ms`);
  console.log(`Max Response Time:  ${maxTime.toFixed(1)}ms`);
  console.log(`Requests/second:    ${(NUM_REQUESTS / (totalTestTime / 1000)).toFixed(1)}`);
  console.log('----------------------------------------');
  
  // Ensure the script exits after completion
  process.exit(0);
}

// Start the stress test with concurrent requests
for (let i = 0; i < Math.min(CONCURRENCY, NUM_REQUESTS); i++) {
  makeRequest();
}
