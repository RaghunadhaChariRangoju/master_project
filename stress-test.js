// Simple stress test using Node.js's built-in http module
// This script will make multiple concurrent requests to the application

import http from 'node:http';
import { performance } from 'node:perf_hooks';

const TARGET_URL = 'http://localhost:3000';
const NUM_REQUESTS = 100;
const CONCURRENT_REQUESTS = 10;
const PATHS = ['/', '/products', '/cart', '/about'];

let completedRequests = 0;
let successfulRequests = 0;
let failedRequests = 0;
let totalResponseTime = 0;
let minResponseTime = Infinity;
let maxResponseTime = 0;

console.log(`Starting stress test against ${TARGET_URL}`);
console.log(`Making ${NUM_REQUESTS} requests (${CONCURRENT_REQUESTS} concurrent)`);
console.log('-----------------------------------');

function makeRequest(path) {
  const startTime = performance.now();
  
  const req = http.get(`${TARGET_URL}${path}`, (res) => {
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    totalResponseTime += responseTime;
    minResponseTime = Math.min(minResponseTime, responseTime);
    maxResponseTime = Math.max(maxResponseTime, responseTime);
    
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      completedRequests++;
      if (res.statusCode >= 200 && res.statusCode < 400) {
        successfulRequests++;
      } else {
        failedRequests++;
        console.log(`Failed request to ${path}: Status ${res.statusCode}`);
      }
      
      if (completedRequests === NUM_REQUESTS) {
        printResults();
      }
    });
  });

  req.on('error', (err) => {
    console.error(`Error making request to ${path}: ${err.message}`);
    completedRequests++;
    failedRequests++;
    
    if (completedRequests === NUM_REQUESTS) {
      printResults();
    }
  });

  req.end();
}

function printResults() {
  console.log('-----------------------------------');
  console.log('Stress Test Results:');
  console.log(`Total Requests: ${NUM_REQUESTS}`);
  console.log(`Successful Requests: ${successfulRequests}`);
  console.log(`Failed Requests: ${failedRequests}`);
  console.log(`Success Rate: ${(successfulRequests / NUM_REQUESTS * 100).toFixed(2)}%`);
  console.log('-----------------------------------');
  console.log('Response Time Metrics:');
  console.log(`Average Response Time: ${(totalResponseTime / NUM_REQUESTS).toFixed(2)}ms`);
  console.log(`Min Response Time: ${minResponseTime.toFixed(2)}ms`);
  console.log(`Max Response Time: ${maxResponseTime.toFixed(2)}ms`);
  console.log('-----------------------------------');
  console.log('Stress test completed successfully');
  
  // Exit the process after printing results
  setTimeout(() => process.exit(0), 1000);
}

// Start the stress test by making requests in batches
let requestsMade = 0;

function startBatch() {
  const batchSize = Math.min(CONCURRENT_REQUESTS, NUM_REQUESTS - requestsMade);
  
  for (let i = 0; i < batchSize; i++) {
    const path = PATHS[Math.floor(Math.random() * PATHS.length)];
    makeRequest(path);
    requestsMade++;
  }
  
  if (requestsMade < NUM_REQUESTS) {
    setTimeout(startBatch, 100); // Adjust timing as needed
  }
}

// Begin the stress test
startBatch();
