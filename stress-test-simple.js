// Simple stress test script using axios
// This will send multiple requests to the local development server
// and report performance metrics

import fetch from 'node-fetch';

// Configuration
const TARGET_URL = 'http://localhost:3000';
const PATHS = ['/', '/products', '/cart', '/about'];
const NUM_REQUESTS = 50;  // Total number of requests to make
const CONCURRENCY = 5;    // Number of concurrent requests

// Metrics
let completed = 0;
let successful = 0;
let failed = 0;
let totalTime = 0;
let minTime = Number.MAX_VALUE;
let maxTime = 0;
let startTime = Date.now();

console.log(`Starting stress test for ${TARGET_URL}`);
console.log(`Making ${NUM_REQUESTS} total requests with ${CONCURRENCY} concurrent requests`);
console.log('----------------------------------------');

async function makeRequest() {
  if (completed >= NUM_REQUESTS) return;
  
  const path = PATHS[Math.floor(Math.random() * PATHS.length)];
  const url = `${TARGET_URL}${path}`;
  const requestStart = Date.now();
  
  try {
    const response = await fetch(url);
    const requestTime = Date.now() - requestStart;
    
    // Update metrics
    totalTime += requestTime;
    minTime = Math.min(minTime, requestTime);
    maxTime = Math.max(maxTime, requestTime);
    
    if (response.status >= 200 && response.status < 400) {
      successful++;
      console.log(`✅ ${response.status} ${path} (${requestTime}ms)`);
    } else {
      failed++;
      console.log(`❌ ${response.status} ${path} (${requestTime}ms)`);
    }
  } catch (error) {
    failed++;
    console.log(`❌ ERROR ${path}: ${error.message}`);
  }
  
  completed++;
  
  // Start next request if we haven't reached the limit
  if (completed < NUM_REQUESTS) {
    makeRequest();
  } else if (completed === NUM_REQUESTS) {
    // All requests completed, show results
    printResults();
  }
}

function printResults() {
  const totalTestTime = Date.now() - startTime;
  
  console.log('----------------------------------------');
  console.log('STRESS TEST RESULTS:');
  console.log('----------------------------------------');
  console.log(`Total Requests:     ${NUM_REQUESTS}`);
  console.log(`Successful:         ${successful}`);
  console.log(`Failed:             ${failed}`);
  console.log(`Success Rate:       ${(successful / NUM_REQUESTS * 100).toFixed(1)}%`);
  console.log('----------------------------------------');
  console.log(`Total Test Time:    ${totalTestTime}ms`);
  console.log(`Avg Response Time:  ${(totalTime / NUM_REQUESTS).toFixed(1)}ms`);
  console.log(`Min Response Time:  ${minTime}ms`);
  console.log(`Max Response Time:  ${maxTime}ms`);
  console.log(`Requests/second:    ${(NUM_REQUESTS / (totalTestTime / 1000)).toFixed(1)}`);
  console.log('----------------------------------------');
}

// Start the stress test with concurrent requests
for (let i = 0; i < Math.min(CONCURRENCY, NUM_REQUESTS); i++) {
  makeRequest();
}
