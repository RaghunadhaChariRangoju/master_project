// Master Test Runner for AG Handloom E-commerce
// This script orchestrates running all test suites sequentially

const { execSync } = require('child_process');
const readline = require('readline');

// Available test suites
const TEST_SUITES = {
  CODE_QUALITY: {
    name: 'Code Quality',
    script: 'code-quality-test.js',
    description: 'Checks TypeScript errors, ESLint compliance, file structure, and unused dependencies'
  },
  API_ENDPOINTS: {
    name: 'API Endpoints',
    script: 'api-endpoint-test.cjs',
    description: 'Tests status and performance of API endpoints and frontend pages'
  },
  BUILD_PERFORMANCE: {
    name: 'Build Performance',
    script: 'build-performance-test.cjs',
    description: 'Evaluates build process, bundle size, and JavaScript performance'
  },
  SEO_ACCESSIBILITY: {
    name: 'SEO & Accessibility',
    script: 'seo-accessibility-test.cjs',
    description: 'Tests SEO best practices and accessibility compliance'
  },
  SECURITY_DATA: {
    name: 'Security & Data Handling',
    script: 'security-data-test.cjs',
    description: 'Checks for security vulnerabilities and proper data handling'
  },
  COMPREHENSIVE: {
    name: 'Comprehensive Test Suite',
    script: 'test-runner.mjs',
    description: 'Evaluates overall structure, code quality, build processes, and more'
  }
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  byCategory: {}
};

// Helper function to run a test script
function runTest(script) {
  console.log(`\n\n=============================================`);
  console.log(`🧪 RUNNING TEST: ${script}`);
  console.log(`=============================================\n`);
  
  try {
    execSync(`node ${script}`, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error running ${script}:`, error.message);
    return false;
  }
}

// Run all tests sequentially
function runAllTests() {
  console.log('\n🧪 MASTER TEST RUNNER 🧪');
  console.log('Running all test suites sequentially...\n');
  
  let allPassed = true;
  
  for (const [key, suite] of Object.entries(TEST_SUITES)) {
    console.log(`\nRunning ${suite.name} tests (${suite.script})...`);
    const success = runTest(suite.script);
    
    if (!success) {
      allPassed = false;
      console.log(`❌ ${suite.name} tests failed or had errors.`);
    } else {
      console.log(`✅ ${suite.name} tests completed.`);
    }
  }
  
  console.log('\n=============================================');
  console.log('🏁 ALL TESTS COMPLETED');
  console.log('=============================================');
  
  if (allPassed) {
    console.log('✅ All test suites ran successfully!');
  } else {
    console.log('⚠️ Some test suites had failures or errors.');
  }
  
  console.log('\nReview the detailed output above for specific test results.');
  
  process.exit(allPassed ? 0 : 1);
}

// Display menu and handle user selection
function showMenu() {
  console.log('\n🧪 AG HANDLOOM E-COMMERCE TEST RUNNER 🧪');
  console.log('=============================================');
  console.log('Select a test suite to run:');
  console.log('=============================================\n');
  
  // List all test suites
  let index = 1;
  const suiteOptions = {};
  
  for (const [key, suite] of Object.entries(TEST_SUITES)) {
    console.log(`${index}. ${suite.name} - ${suite.description}`);
    suiteOptions[index.toString()] = key;
    index++;
  }
  
  console.log(`\n${index}. Run ALL test suites`);
  console.log('0. Exit');
  
  // Get user selection
  rl.question('\nEnter the number of your choice: ', (answer) => {
    if (answer === '0') {
      console.log('Exiting test runner...');
      rl.close();
      return;
    }
    
    if (answer === index.toString()) {
      rl.close();
      runAllTests();
      return;
    }
    
    const suiteKey = suiteOptions[answer];
    if (suiteKey && TEST_SUITES[suiteKey]) {
      const suite = TEST_SUITES[suiteKey];
      console.log(`\nRunning ${suite.name} tests...`);
      rl.close();
      runTest(suite.script);
    } else {
      console.log('Invalid selection. Please try again.');
      showMenu();
    }
  });
}

// Check for direct command line arguments
const [,, testSuiteArg] = process.argv;

if (testSuiteArg === '--all') {
  runAllTests();
} else if (testSuiteArg && TEST_SUITES[testSuiteArg.toUpperCase()]) {
  const suite = TEST_SUITES[testSuiteArg.toUpperCase()];
  runTest(suite.script);
} else if (testSuiteArg) {
  console.log(`Unknown test suite: ${testSuiteArg}`);
  console.log('Available options:');
  for (const [key, suite] of Object.entries(TEST_SUITES)) {
    console.log(`  ${key.toLowerCase()} - ${suite.name}`);
  }
  console.log('  --all - Run all test suites');
} else {
  // No arguments, show interactive menu
  showMenu();
}
