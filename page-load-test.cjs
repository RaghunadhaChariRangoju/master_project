// Frontend Page Load Test Script (CommonJS format)
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3000';
const PAGES = [
  { path: '/', name: 'Home Page' },
  { path: '/products', name: 'Products Page' },
  { path: '/cart', name: 'Cart Page' },
  { path: '/about', name: 'About Page' },
  { path: '/contact', name: 'Contact Page' },
  { path: '/login', name: 'Login Page' },
  { path: '/register', name: 'Register Page' },
  { path: '/profile', name: 'Profile Page' },
  { path: '/checkout', name: 'Checkout Page' }
];

const NUM_REQUESTS_PER_PAGE = 10;
const CONCURRENT_REQUESTS = 5;

// Stats tracking
const stats = {
  totalRequests: 0,
  completed: 0,
  successful: 0,
  failed: 0,
  timeouts: 0,
  startTime: Date.now(),
  pages: {}
};

// Initialize page stats
PAGES.forEach(page => {
  stats.pages[page.path] = {
    name: page.name,
    requests: 0,
    successful: 0,
    failed: 0,
    totalTime: 0,
    minTime: Number.MAX_VALUE,
    maxTime: 0,
    totalSize: 0
  };
});

// Total number of requests to make
const TOTAL_REQUESTS = PAGES.length * NUM_REQUESTS_PER_PAGE;

// Function to make a page request
function makeRequest(page) {
  return new Promise((resolve) => {
    const { path, name } = page;
    const startTime = Date.now();
    
    // Update stats
    stats.totalRequests++;
    stats.pages[path].requests++;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Accept': 'text/html'
      },
      timeout: 10000 // 10 second timeout
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const duration = endTime - startTime;
        const pageStats = stats.pages[path];
        const contentLength = parseInt(res.headers['content-length'] || data.length, 10);
        
        // Update timing stats
        pageStats.totalTime += duration;
        pageStats.minTime = Math.min(pageStats.minTime, duration);
        pageStats.maxTime = Math.max(pageStats.maxTime, duration);
        pageStats.totalSize += contentLength;
        
        // Check if request was successful (2xx status code)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          stats.successful++;
          pageStats.successful++;
          console.log(`✓ ${name} - ${res.statusCode} (${duration}ms, ${formatSize(contentLength)})`);
        } else {
          stats.failed++;
          pageStats.failed++;
          console.log(`✗ ${name} - ${res.statusCode} (${duration}ms)`);
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
      stats.pages[path].failed++;
      
      if (err.code === 'ETIMEDOUT') {
        stats.timeouts++;
        console.log(`✗ ${name} - TIMEOUT (${duration}ms)`);
      } else {
        console.log(`✗ ${name} - ERROR: ${err.message} (${duration}ms)`);
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

// Helper function to format file size
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Function to print test summary
function printSummary() {
  const totalDuration = Date.now() - stats.startTime;
  const throughput = (stats.completed / (totalDuration / 1000)).toFixed(2);
  
  console.log('\n========== PAGE LOAD TEST SUMMARY ==========');
  console.log(`Total Requests: ${stats.totalRequests}`);
  console.log(`Successful: ${stats.successful} (${((stats.successful / stats.totalRequests) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${stats.failed} (${((stats.failed / stats.totalRequests) * 100).toFixed(1)}%)`);
  console.log(`Timeouts: ${stats.timeouts}`);
  console.log(`Total Test Duration: ${(totalDuration / 1000).toFixed(2)} seconds`);
  console.log(`Throughput: ${throughput} requests/second`);
  
  console.log('\n========== PAGE PERFORMANCE ==========');
  console.log('Page | Requests | Success Rate | Avg Time | Avg Size | Min Time | Max Time');
  console.log('-----|----------|--------------|----------|----------|----------|----------');
  
  Object.keys(stats.pages).forEach(path => {
    const page = stats.pages[path];
    
    if (page.requests > 0) {
      const successRate = ((page.successful / page.requests) * 100).toFixed(1);
      const avgTime = (page.totalTime / page.requests).toFixed(1);
      const avgSize = formatSize(Math.round(page.totalSize / page.requests));
      
      console.log(
        `${page.name.padEnd(20)} | ` +
        `${page.requests.toString().padEnd(8)} | ` +
        `${successRate.padEnd(12)}% | ` +
        `${avgTime.padEnd(8)}ms | ` +
        `${avgSize.padEnd(8)} | ` +
        `${page.minTime.toString().padEnd(8)}ms | ` +
        `${page.maxTime.toString().padEnd(8)}ms`
      );
    }
  });
  
  // Provide some performance recommendations
  console.log('\n========== RECOMMENDATIONS ==========');
  
  // Identify slow pages (above 300ms average)
  const slowPages = Object.keys(stats.pages)
    .filter(path => stats.pages[path].requests > 0 && (stats.pages[path].totalTime / stats.pages[path].requests) > 300)
    .map(path => stats.pages[path]);
  
  if (slowPages.length > 0) {
    console.log('Slow pages that could be optimized:');
    slowPages.forEach(page => {
      console.log(`- ${page.name}: Avg time ${(page.totalTime / page.requests).toFixed(1)}ms`);
    });
  } else {
    console.log('✓ All pages load reasonably quickly (under 300ms average)');
  }
  
  // Check overall success rate
  const successRate = ((stats.successful / stats.totalRequests) * 100);
  if (successRate < 95) {
    console.log(`! Overall success rate (${successRate.toFixed(1)}%) is below 95%. Check for errors or unavailable pages.`);
  } else {
    console.log(`✓ Overall success rate is good at ${successRate.toFixed(1)}%`);
  }
  
  // Check throughput
  if (parseFloat(throughput) < 10) {
    console.log(`! Throughput of ${throughput} requests/second might be improved with better server resources or code optimization`);
  } else {
    console.log(`✓ Throughput is good at ${throughput} requests/second`);
  }
  
  // Exit process
  process.exit(0);
}

// Function to run the stress test
async function runLoadTest() {
  console.log(`Starting page load test against ${BASE_URL}`);
  console.log(`Testing ${PAGES.length} pages with ${NUM_REQUESTS_PER_PAGE} requests each`);
  console.log(`Concurrency level: ${CONCURRENT_REQUESTS}`);
  console.log('-'.repeat(60));
  
  // Create a queue of requests to make
  const requestQueue = [];
  
  PAGES.forEach(page => {
    for (let i = 0; i < NUM_REQUESTS_PER_PAGE; i++) {
      requestQueue.push(page);
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
        const page = requestQueue.shift();
        batch.push(makeRequest(page));
      }
      
      await Promise.all(batch);
    }
  }
  
  await processQueue();
}

// Run the load test
runLoadTest();
