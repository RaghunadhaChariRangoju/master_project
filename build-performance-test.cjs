// Build and Performance Test for AG Handloom E-commerce
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const MAX_ACCEPTABLE_BUNDLE_SIZE = 2 * 1024 * 1024; // 2MB
const MIN_COMPRESSION_RATIO = 0.7; // 70% or better compression expected

// Test results
const results = {
  totalTests: 0,
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to record test results
function recordTest(name, success, details = {}) {
  results.totalTests++;
  if (success) {
    results.passed++;
    console.log(`✅ PASSED: ${name}`);
  } else {
    results.failed++;
    console.log(`❌ FAILED: ${name}`);
  }
  
  results.tests.push({
    name,
    success,
    ...details
  });
  
  if (details.error) {
    console.log(`   Error: ${details.error}`);
  }
  if (details.message) {
    console.log(`   ${details.message}`);
  }
}

// Helper function to format file size
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
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

// Helper function to get directory size
function getDirectorySize(directoryPath) {
  let totalSize = 0;
  
  function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        processDirectory(filePath);
      } else {
        totalSize += stats.size;
      }
    }
  }
  
  processDirectory(directoryPath);
  return totalSize;
}

// Test 1: Verify package.json has correct build scripts
function testBuildScripts() {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const hasBuildScript = packageJson.scripts && packageJson.scripts.build;
    const hasPreviewScript = packageJson.scripts && packageJson.scripts.preview;
    
    if (hasBuildScript && hasPreviewScript) {
      recordTest('Build Scripts', true, {
        message: `Found build script: "${packageJson.scripts.build}" and preview script: "${packageJson.scripts.preview}"`
      });
    } else {
      const missing = [];
      if (!hasBuildScript) missing.push('build');
      if (!hasPreviewScript) missing.push('preview');
      
      recordTest('Build Scripts', false, {
        error: `Missing required scripts: ${missing.join(', ')}`
      });
    }
  } catch (error) {
    recordTest('Build Scripts', false, {
      error: error.message
    });
  }
}

// Test 2: Development build
function testDevBuild() {
  try {
    console.log('Running development build...');
    
    // Run the build with timing
    const startTime = Date.now();
    execSync('npm run build:dev', { stdio: 'pipe' });
    const endTime = Date.now();
    const buildTime = ((endTime - startTime) / 1000).toFixed(2);
    
    // Check if dist directory exists
    const distPath = path.join(__dirname, 'dist');
    if (!fileExists(distPath)) {
      recordTest('Development Build', false, {
        error: 'Build completed but dist directory was not created'
      });
      return;
    }
    
    // Check dist for expected files
    const hasIndexHtml = fileExists(path.join(distPath, 'index.html'));
    const hasAssets = fileExists(path.join(distPath, 'assets'));
    
    if (!hasIndexHtml || !hasAssets) {
      const missing = [];
      if (!hasIndexHtml) missing.push('index.html');
      if (!hasAssets) missing.push('assets directory');
      
      recordTest('Development Build', false, {
        error: `Build output is missing critical files: ${missing.join(', ')}`
      });
      return;
    }
    
    // Get build size
    const buildSize = getDirectorySize(distPath);
    
    recordTest('Development Build', true, {
      message: `Build completed in ${buildTime}s. Size: ${formatSize(buildSize)}.`
    });
  } catch (error) {
    recordTest('Development Build', false, {
      error: error.stdout ? error.stdout.toString() : error.message
    });
  }
}

// Test 3: Production build
function testProductionBuild() {
  try {
    console.log('Running production build...');
    
    // Run the build with timing
    const startTime = Date.now();
    execSync('npm run build', { stdio: 'pipe' });
    const endTime = Date.now();
    const buildTime = ((endTime - startTime) / 1000).toFixed(2);
    
    // Check if dist directory exists
    const distPath = path.join(__dirname, 'dist');
    if (!fileExists(distPath)) {
      recordTest('Production Build', false, {
        error: 'Build completed but dist directory was not created'
      });
      return;
    }
    
    // Check dist for expected files
    const hasIndexHtml = fileExists(path.join(distPath, 'index.html'));
    const hasAssets = fileExists(path.join(distPath, 'assets'));
    
    if (!hasIndexHtml || !hasAssets) {
      const missing = [];
      if (!hasIndexHtml) missing.push('index.html');
      if (!hasAssets) missing.push('assets directory');
      
      recordTest('Production Build', false, {
        error: `Build output is missing critical files: ${missing.join(', ')}`
      });
      return;
    }
    
    // Get build size
    const buildSize = getDirectorySize(distPath);
    const isSizeAcceptable = buildSize <= MAX_ACCEPTABLE_BUNDLE_SIZE;
    
    recordTest('Production Build', true, {
      message: `Build completed in ${buildTime}s. Size: ${formatSize(buildSize)}${!isSizeAcceptable ? ' (exceeds recommended size)' : ''}.`
    });
    
    // Additional test for bundle size
    recordTest('Bundle Size Check', isSizeAcceptable, {
      message: isSizeAcceptable ? 
        `Bundle size ${formatSize(buildSize)} is within acceptable limit of ${formatSize(MAX_ACCEPTABLE_BUNDLE_SIZE)}` :
        `Bundle size ${formatSize(buildSize)} exceeds acceptable limit of ${formatSize(MAX_ACCEPTABLE_BUNDLE_SIZE)}`
    });
  } catch (error) {
    recordTest('Production Build', false, {
      error: error.stdout ? error.stdout.toString() : error.message
    });
  }
}

// Test 4: Analyze JS bundle performance
function analyzeJsBundle() {
  try {
    const distPath = path.join(__dirname, 'dist');
    const assetsPath = path.join(distPath, 'assets');
    
    if (!fileExists(assetsPath)) {
      recordTest('JS Bundle Analysis', false, {
        error: 'Assets directory not found. Run a production build first.'
      });
      return;
    }
    
    // Find all JS files in assets
    const jsFiles = [];
    
    function findJsFiles(dirPath) {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          findJsFiles(filePath);
        } else if (file.endsWith('.js')) {
          jsFiles.push({
            path: filePath,
            size: stats.size,
            name: file
          });
        }
      }
    }
    
    findJsFiles(assetsPath);
    
    // Sort by size (largest first)
    jsFiles.sort((a, b) => b.size - a.size);
    
    // Analyze results
    const totalJsSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
    const avgFileSize = jsFiles.length > 0 ? totalJsSize / jsFiles.length : 0;
    const largestFile = jsFiles.length > 0 ? jsFiles[0] : null;
    
    // Get the index.html content
    const indexHtmlPath = path.join(distPath, 'index.html');
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    
    // Check for code splitting
    const jsScriptTags = (indexHtml.match(/<script[^>]*src="[^"]*\.js"[^>]*>/g) || []);
    const hasManyScripts = jsScriptTags.length > 2; // Good indication of code splitting
    
    // Check if main chunk is reasonably sized
    const isMainJsSizeGood = largestFile && largestFile.size < 500 * 1024; // 500KB is a decent limit
    
    // Output
    const message = `Found ${jsFiles.length} JS files totaling ${formatSize(totalJsSize)}.\n` +
      `   Average file size: ${formatSize(avgFileSize)}\n` +
      `   Largest JS file: ${largestFile ? largestFile.name + ' (' + formatSize(largestFile.size) + ')' : 'N/A'}\n` +
      `   Code splitting: ${hasManyScripts ? 'Detected' : 'Not detected or minimal'}\n` +
      `   Main chunk size: ${isMainJsSizeGood ? 'Good' : 'Too large'}`;
    
    recordTest('JS Bundle Analysis', isMainJsSizeGood, { message });
  } catch (error) {
    recordTest('JS Bundle Analysis', false, {
      error: error.message
    });
  }
}

// Test 5: Check for minification and optimization
function testMinification() {
  try {
    const distPath = path.join(__dirname, 'dist');
    const assetsPath = path.join(distPath, 'assets');
    
    if (!fileExists(assetsPath)) {
      recordTest('Code Minification', false, {
        error: 'Assets directory not found. Run a production build first.'
      });
      return;
    }
    
    // Find the first JS file to check
    let jsFilePath = null;
    
    function findFirstJsFile(dirPath) {
      if (jsFilePath) return;
      
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        if (jsFilePath) break;
        
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          findFirstJsFile(filePath);
        } else if (file.endsWith('.js')) {
          jsFilePath = filePath;
          break;
        }
      }
    }
    
    findFirstJsFile(assetsPath);
    
    if (!jsFilePath) {
      recordTest('Code Minification', false, {
        error: 'No JavaScript files found in build output'
      });
      return;
    }
    
    // Read part of the file content
    const fileContent = fs.readFileSync(jsFilePath, 'utf8').slice(0, 1000);
    
    // Check for minification signs
    const isMinified = 
      !fileContent.includes('\n  ') && // No indentation
      !fileContent.match(/\w+\s{2,}\w+/) && // No multiple spaces between words
      fileContent.includes(';') && // Has semicolons
      !fileContent.match(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g); // No comments
    
    recordTest('Code Minification', isMinified, {
      message: isMinified 
        ? 'JavaScript files are properly minified' 
        : 'JavaScript files do not appear to be properly minified'
    });
  } catch (error) {
    recordTest('Code Minification', false, {
      error: error.message
    });
  }
}

// Main function to run all tests
function runBuildTests() {
  console.log('\n🧪 BUILD AND PERFORMANCE TESTS 🧪');
  console.log('===============================================');
  
  // Run all tests
  testBuildScripts();
  testDevBuild();
  testProductionBuild();
  analyzeJsBundle();
  testMinification();
  
  // Print summary
  console.log('\n===============================================');
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('===============================================');
  console.log(`Total tests: ${results.totalTests}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  
  console.log('\n✨ Build and performance testing completed ✨');
}

// Run the tests
runBuildTests();
