// Security and Data Handling Test for AG Handloom E-commerce
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const ROOT_DIR = path.resolve('.');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Test results
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to record test results
function recordTest(category, name, passed, details = {}) {
  results.total++;
  if (passed) {
    results.passed++;
    console.log(`✅ PASSED: [${category}] ${name}`);
  } else {
    results.failed++;
    console.log(`❌ FAILED: [${category}] ${name}`);
  }
  
  if (details.message) {
    console.log(`   ${details.message}`);
  }
  
  if (details.error) {
    console.log(`   Error: ${details.error}`);
  }
  
  results.tests.push({
    category,
    name,
    passed,
    ...details
  });
}

// Helper function to check if a file exists
function fileExists(filePath) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

// Helper function to find files matching a pattern
function findFiles(directory, pattern) {
  const results = [];
  
  function traverse(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
        traverse(filePath);
      } else if (stat.isFile() && pattern.test(file)) {
        results.push(filePath);
      }
    }
  }
  
  traverse(directory);
  return results;
}

// Helper function to search files for content
function searchInFiles(files, searchRegex) {
  const matches = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const fileMatches = content.match(searchRegex);
      
      if (fileMatches && fileMatches.length > 0) {
        matches.push({
          file: path.relative(ROOT_DIR, file),
          matches: fileMatches,
          count: fileMatches.length
        });
      }
    } catch (error) {
      // Skip files that can't be read as text
    }
  }
  
  return matches;
}

// 1. Security Tests

// Test 1.1: Check for hardcoded credentials/secrets
function testHardcodedSecrets() {
  const secretPatterns = [
    /['"]([a-zA-Z0-9]{20,})['"]/, // Long alphanumeric strings
    /key['"]\s*:\s*['"]([\w\-]{10,})['"]/i, // Anything labeled as a key
    /password['"]\s*:\s*['"]([^'"]{3,})['"]/, // Passwords
    /secret['"]\s*:\s*['"]([^'"]{3,})['"]/, // Secrets
    /auth(?:entication)?['"]\s*:\s*['"]([^'"]{8,})['"]/, // Auth tokens
    /(?:api|app)key['"]\s*:\s*['"]([^'"]{8,})['"]/, // API keys
    /bearer\s+['"]([^'"]{8,})['"]/, // Bearer tokens
    /supabase(?:url|key)['"]\s*:\s*['"]([^'"]{3,})['"]/, // Supabase credentials
  ];
  
  const excludePatterns = [
    /process\.env\./,
    /import\.meta\.env\./,
    /env\./,
    /\{\{/,
    /placeholder/i,
    /example/i,
    /mock/i,
    /["']YOUR_/i,
  ];
  
  const sourceFiles = findFiles(SRC_DIR, /\.(js|jsx|ts|tsx|json)$/);
  
  let potentialSecrets = [];
  
  for (const file of sourceFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      for (const pattern of secretPatterns) {
        const matches = content.match(new RegExp(pattern, 'g'));
        
        if (matches) {
          // Check if any of the matches are not in excluded patterns
          const nonExcludedMatches = matches.filter(match => {
            // Check if the match contains any of the exclude patterns
            return !excludePatterns.some(excludePattern => excludePattern.test(match));
          });
          
          if (nonExcludedMatches.length > 0) {
            potentialSecrets.push({
              file: path.relative(ROOT_DIR, file),
              secrets: nonExcludedMatches,
              count: nonExcludedMatches.length
            });
          }
        }
      }
    } catch (error) {
      // Skip binary files or files that can't be read as text
    }
  }
  
  // Remove false positives by checking for strings that are too short or common
  potentialSecrets = potentialSecrets.filter(item => {
    item.secrets = item.secrets.filter(secret => {
      // Extract the secret value from the match
      const valueMatch = secret.match(/['"]([^'"]{3,})['"]/);
      const value = valueMatch ? valueMatch[1] : '';
      
      // Skip short values or values that look like configuration
      return value.length >= 10 && !/^(true|false|null|undefined|\d+px|\d+%|#[0-9a-f]{3,6})$/i.test(value);
    });
    
    item.count = item.secrets.length;
    return item.count > 0;
  });
  
  if (potentialSecrets.length > 0) {
    recordTest('Security', 'Hardcoded Secrets', false, {
      error: `Found ${potentialSecrets.length} files with potential hardcoded secrets`,
      message: `Files with potential secrets: ${potentialSecrets.map(s => `${s.file} (${s.count})`).join(', ')}`
    });
  } else {
    recordTest('Security', 'Hardcoded Secrets', true, {
      message: 'No hardcoded secrets detected in source files'
    });
  }
}

// Test 1.2: Check for proper .env usage
function testEnvUsage() {
  // Check for .env.example or similar file
  const envFiles = [
    '.env.example',
    '.env.template',
    '.env.sample',
    '.env.local.example'
  ].map(file => path.join(ROOT_DIR, file));
  
  const hasEnvExample = envFiles.some(file => fileExists(file));
  
  // Check for .env in gitignore
  const gitignorePath = path.join(ROOT_DIR, '.gitignore');
  let envInGitignore = false;
  
  if (fileExists(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    envInGitignore = gitignoreContent.includes('.env') || 
                    gitignoreContent.includes('*.env') ||
                    gitignoreContent.includes('.env*');
  }
  
  // Check for environment variable usage in code
  const sourceFiles = findFiles(SRC_DIR, /\.(js|jsx|ts|tsx)$/);
  const envUsageMatches = searchInFiles(sourceFiles, /process\.env\.|import\.meta\.env\./g);
  
  if (!hasEnvExample) {
    recordTest('Security', 'Environment Variables', false, {
      error: 'No .env.example or similar template file found',
      message: 'An example environment file should be included in the repository for documentation'
    });
    return;
  }
  
  if (!envInGitignore) {
    recordTest('Security', 'Environment Variables', false, {
      error: '.env files are not excluded in .gitignore',
      message: 'Add .env* to your .gitignore to prevent sensitive information from being committed'
    });
    return;
  }
  
  if (envUsageMatches.length === 0) {
    recordTest('Security', 'Environment Variables', false, {
      error: 'No environment variable usage found in the code',
      message: 'Environment variables should be used for configuration and secrets'
    });
    return;
  }
  
  recordTest('Security', 'Environment Variables', true, {
    message: `Found proper environment variable usage in ${envUsageMatches.length} files`
  });
}

// Test 1.3: Check for HTTPS/SSL configuration
function testHttpsConfiguration() {
  // Check for HTTPS configuration in vite.config.js
  const viteConfigPath = path.join(ROOT_DIR, 'vite.config.js');
  const viteConfigTsPath = path.join(ROOT_DIR, 'vite.config.ts');
  let viteConfigContent = '';
  
  if (fileExists(viteConfigPath)) {
    viteConfigContent = fs.readFileSync(viteConfigPath, 'utf8');
  } else if (fileExists(viteConfigTsPath)) {
    viteConfigContent = fs.readFileSync(viteConfigTsPath, 'utf8');
  }
  
  // Look for https configuration in Vite config
  const hasHttpsConfig = viteConfigContent.includes('https:') || 
                         viteConfigContent.includes('httpsOptions');
  
  // Check for Content-Security-Policy
  const htmlFiles = findFiles(SRC_DIR, /\.(html)$/).concat(findFiles(PUBLIC_DIR, /\.(html)$/));
  const cspMatches = searchInFiles(htmlFiles, /<meta[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/g);
  
  // Check for HTTPS redirects or requirements in source code
  const sourceFiles = findFiles(SRC_DIR, /\.(js|jsx|ts|tsx)$/);
  const httpsRedirectMatches = searchInFiles(sourceFiles, /https?:\/\/|location\.protocol|redirectToHttps|requireHttps|isSecure/g);
  
  if (!hasHttpsConfig && cspMatches.length === 0 && httpsRedirectMatches.length === 0) {
    recordTest('Security', 'HTTPS Configuration', false, {
      error: 'No HTTPS configuration found',
      message: 'Consider adding HTTPS configuration for production environments'
    });
  } else {
    recordTest('Security', 'HTTPS Configuration', true, {
      message: `Found ${hasHttpsConfig ? 'HTTPS config in Vite, ' : ''}${cspMatches.length > 0 ? 'Content-Security-Policy, ' : ''}${httpsRedirectMatches.length > 0 ? 'HTTPS code references' : ''}`
    });
  }
}

// Test 1.4: Check for authentication implementation
function testAuthImplementation() {
  const authFiles = findFiles(SRC_DIR, /auth|login|register|sign(in|up|out)/i);
  
  if (authFiles.length === 0) {
    recordTest('Security', 'Authentication', false, {
      error: 'No authentication files found',
      message: 'Make sure authentication is properly implemented for an e-commerce application'
    });
    return;
  }
  
  // Check for token storage (safer in httpOnly cookies)
  const sourceFiles = findFiles(SRC_DIR, /\.(js|jsx|ts|tsx)$/);
  const localStorageMatches = searchInFiles(sourceFiles, /localStorage\.(get|set)Item\(['"]token['"]/g);
  const cookieMatches = searchInFiles(sourceFiles, /document\.cookie|cookies\.|httpOnly/g);
  
  if (localStorageMatches.length > 0 && cookieMatches.length === 0) {
    recordTest('Security', 'Authentication', false, {
      error: 'Tokens may be stored in localStorage instead of secure cookies',
      message: 'Consider using httpOnly cookies for authentication tokens instead of localStorage'
    });
    return;
  }
  
  // Check for logout functionality
  const logoutMatches = searchInFiles(sourceFiles, /logout|signout|sign[\s_-]?out/i);
  
  if (logoutMatches.length === 0) {
    recordTest('Security', 'Authentication', false, {
      error: 'Logout functionality not found',
      message: 'Ensure proper logout functionality is implemented to clear authentication state'
    });
    return;
  }
  
  recordTest('Security', 'Authentication', true, {
    message: `Found ${authFiles.length} authentication-related files with proper implementation patterns`
  });
}

// 2. Data Handling Tests

// Test 2.1: Check for form validation
function testFormValidation() {
  const sourceFiles = findFiles(SRC_DIR, /\.(js|jsx|ts|tsx)$/);
  
  // Check for common validation libraries or patterns
  const zodMatches = searchInFiles(sourceFiles, /zod|z\.(string|number|boolean|object|array)/g);
  const yupMatches = searchInFiles(sourceFiles, /yup|Yup\.(string|number|boolean|object|array)/g);
  const formikMatches = searchInFiles(sourceFiles, /formik|useFormik|Formik/g);
  const reactHookFormMatches = searchInFiles(sourceFiles, /useForm|register\([^)]*\)|handleSubmit/g);
  const validationPatternMatches = searchInFiles(sourceFiles, /validate|validation|validator|isValid|errors\./g);
  
  const hasValidation = zodMatches.length > 0 || 
                        yupMatches.length > 0 || 
                        formikMatches.length > 0 || 
                        reactHookFormMatches.length > 0 || 
                        validationPatternMatches.length > 0;
  
  if (!hasValidation) {
    recordTest('Data Handling', 'Form Validation', false, {
      error: 'No form validation patterns detected',
      message: 'Implement client-side validation using libraries like Zod, Yup, Formik, or React Hook Form'
    });
  } else {
    recordTest('Data Handling', 'Form Validation', true, {
      message: `Found validation patterns: ${
        [
          zodMatches.length > 0 ? 'Zod' : '',
          yupMatches.length > 0 ? 'Yup' : '',
          formikMatches.length > 0 ? 'Formik' : '',
          reactHookFormMatches.length > 0 ? 'React Hook Form' : '',
          validationPatternMatches.length > 0 ? 'Custom validation' : ''
        ].filter(Boolean).join(', ')
      }`
    });
  }
}

// Test 2.2: Check for error handling
function testErrorHandling() {
  const sourceFiles = findFiles(SRC_DIR, /\.(js|jsx|ts|tsx)$/);
  
  // Check for try-catch blocks
  const tryCatchMatches = searchInFiles(sourceFiles, /try\s*{[^}]*}\s*catch/g);
  
  // Check for error state management
  const errorStateMatches = searchInFiles(sourceFiles, /\b(error|errors|setError|setErrors|isError|hasError)\b/g);
  
  // Check for error boundaries
  const errorBoundaryMatches = searchInFiles(sourceFiles, /ErrorBoundary|componentDidCatch|getDerivedStateFromError/g);
  
  if (tryCatchMatches.length === 0 && errorStateMatches.length === 0 && errorBoundaryMatches.length === 0) {
    recordTest('Data Handling', 'Error Handling', false, {
      error: 'No error handling patterns detected',
      message: 'Implement proper error handling using try/catch, error states, and error boundaries'
    });
  } else {
    recordTest('Data Handling', 'Error Handling', true, {
      message: `Found error handling patterns: ${tryCatchMatches.length} try/catch blocks, ${errorStateMatches.length} error state references, ${errorBoundaryMatches.length} error boundary references`
    });
  }
}

// Test 2.3: Check for data fetching patterns
function testDataFetching() {
  const sourceFiles = findFiles(SRC_DIR, /\.(js|jsx|ts|tsx)$/);
  
  // Check for modern data fetching libraries
  const reactQueryMatches = searchInFiles(sourceFiles, /useQuery|useMutation|queryClient|QueryClient/g);
  const rtqQueryMatches = searchInFiles(sourceFiles, /createApi|fetchBaseQuery|RTK Query/g);
  const swr = searchInFiles(sourceFiles, /useSWR|mutate|SWRConfig/g);
  const apolloMatches = searchInFiles(sourceFiles, /useQuery|useMutation|ApolloClient|gql`/g);
  
  // Check for raw fetch/axios usage
  const fetchMatches = searchInFiles(sourceFiles, /fetch\(|\.then\(|\.catch\(/g);
  const axiosMatches = searchInFiles(sourceFiles, /axios\.|\.get\(|\.post\(|\.put\(/g);
  
  const hasModernFetching = reactQueryMatches.length > 0 || 
                           rtqQueryMatches.length > 0 || 
                           swr.length > 0 ||
                           apolloMatches.length > 0;
                           
  const hasBasicFetching = fetchMatches.length > 0 || axiosMatches.length > 0;
  
  if (!hasModernFetching && !hasBasicFetching) {
    recordTest('Data Handling', 'Data Fetching', false, {
      error: 'No data fetching patterns detected',
      message: 'Implement data fetching using modern libraries like React Query, RTK Query, SWR, or Apollo'
    });
  } else if (hasBasicFetching && !hasModernFetching) {
    recordTest('Data Handling', 'Data Fetching', false, {
      error: 'Using basic fetch/axios without modern data fetching libraries',
      message: 'Consider using modern libraries like React Query, RTK Query, or SWR for better caching and error handling'
    });
  } else {
    recordTest('Data Handling', 'Data Fetching', true, {
      message: `Using modern data fetching: ${
        [
          reactQueryMatches.length > 0 ? 'React Query' : '',
          rtqQueryMatches.length > 0 ? 'RTK Query' : '',
          swr.length > 0 ? 'SWR' : '',
          apolloMatches.length > 0 ? 'Apollo' : ''
        ].filter(Boolean).join(', ')
      }`
    });
  }
}

// Test 2.4: Check for API response handling
function testApiResponseHandling() {
  const sourceFiles = findFiles(SRC_DIR, /\.(js|jsx|ts|tsx)$/);
  
  // Check for response status code handling
  const statusCheckMatches = searchInFiles(sourceFiles, /status(Code)?|response\.ok|res\.status|response\.status/g);
  
  // Check for data parsing
  const jsonParseMatches = searchInFiles(sourceFiles, /\.json\(\)|JSON\.parse/g);
  
  if (statusCheckMatches.length === 0) {
    recordTest('Data Handling', 'API Response Handling', false, {
      error: 'No API status code handling detected',
      message: 'Implement proper handling of API response status codes'
    });
  } else if (jsonParseMatches.length === 0) {
    recordTest('Data Handling', 'API Response Handling', false, {
      error: 'No JSON parsing detected',
      message: 'Ensure proper parsing of API responses'
    });
  } else {
    recordTest('Data Handling', 'API Response Handling', true, {
      message: `Found ${statusCheckMatches.length} status code checks and ${jsonParseMatches.length} JSON parsing operations`
    });
  }
}

// Main function to run all tests
function runSecurityAndDataTests() {
  console.log('\n🧪 SECURITY AND DATA HANDLING TESTS 🧪');
  console.log('===============================================');
  
  // Security Tests
  console.log('\n🔒 Running Security Tests...');
  testHardcodedSecrets();
  testEnvUsage();
  testHttpsConfiguration();
  testAuthImplementation();
  
  // Data Handling Tests
  console.log('\n📊 Running Data Handling Tests...');
  testFormValidation();
  testErrorHandling();
  testDataFetching();
  testApiResponseHandling();
  
  // Print summary
  console.log('\n===============================================');
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('===============================================');
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  // Print category breakdown
  const categories = [...new Set(results.tests.map(test => test.category))];
  for (const category of categories) {
    const categoryTests = results.tests.filter(test => test.category === category);
    const passed = categoryTests.filter(test => test.passed).length;
    console.log(`${category}: ${passed}/${categoryTests.length} passed`);
  }
  
  console.log('\n✨ Security and Data Handling testing completed ✨');
}

// Run the tests
runSecurityAndDataTests();
