// AG Handloom E-commerce Application Test Runner
// Uses ES Modules format compatible with the project

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';
import http from 'http';

// Convert __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const APP_URL = 'http://localhost:3000';
const TEST_TIMEOUT = 30000; // 30 seconds
const COMPONENT_TEST_TIMEOUT = 5000; // 5 seconds per component

// Test categories
const TEST_CATEGORIES = {
  STRUCTURE: 'File Structure Tests',
  CODE_QUALITY: 'Code Quality Tests',
  BUILD: 'Build Tests',
  FRONTEND: 'Frontend Component Tests',
  PERFORMANCE: 'Performance Tests',
  SEO: 'SEO Tests',
  SECURITY: 'Security Tests',
};

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  details: []
};

// Helper functions
async function runTest(category, name, testFn) {
  console.log(`\n🔍 Running ${category}: ${name}...`);
  
  try {
    const startTime = Date.now();
    const result = await Promise.race([
      testFn(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Test timed out')), TEST_TIMEOUT)
      )
    ]);
    const duration = Date.now() - startTime;
    
    console.log(`✅ PASSED: ${name} (${duration}ms)`);
    testResults.passed++;
    testResults.details.push({
      category,
      name,
      status: 'PASSED',
      duration,
      result
    });
    return true;
  } catch (error) {
    console.log(`❌ FAILED: ${name}`);
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.details.push({
      category,
      name,
      status: 'FAILED',
      error: error.message
    });
    return false;
  }
}

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// ==============================================================
// 1. FILE STRUCTURE TESTS
// ==============================================================

async function testProjectStructure() {
  const requiredDirs = [
    'src',
    'src/components',
    'src/lib',
    'src/hooks',
    'src/contexts',
    'public',
  ];
  
  const missingDirs = [];
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(__dirname, dir);
    if (!(await checkFileExists(dirPath))) {
      missingDirs.push(dir);
    }
  }
  
  if (missingDirs.length > 0) {
    throw new Error(`Missing required directories: ${missingDirs.join(', ')}`);
  }
  
  return `Project structure is valid. All ${requiredDirs.length} required directories exist.`;
}

async function testEnvFiles() {
  // Check if env files exist
  const envExample = path.join(__dirname, '.env.example');
  const envLocal = path.join(__dirname, '.env');
  const envExampleExists = await checkFileExists(envExample);
  const envLocalExists = await checkFileExists(envLocal);
  
  // Report findings
  if (!envExampleExists) {
    throw new Error('.env.example file not found. This file should be included in the repo.');
  }
  
  if (!envLocalExists) {
    console.log('   ⚠️ Warning: .env file not found. Make sure to create this before deployment.');
  }
  
  return `Environment file structure is valid. ${envExampleExists ? '.env.example exists' : ''} ${envLocalExists ? 'and .env exists' : ''}`;
}

async function testStaticAssets() {
  const publicDir = path.join(__dirname, 'public');
  const items = await fs.readdir(publicDir, { withFileTypes: true });
  
  // Check for important static files
  const hasIndex = items.some(item => item.name === 'index.html');
  const hasFavicon = items.some(item => item.name === 'favicon.ico' || item.name.startsWith('favicon.'));
  const hasRobots = items.some(item => item.name === 'robots.txt');
  
  const issues = [];
  if (!hasIndex) issues.push('Missing index.html');
  if (!hasFavicon) issues.push('Missing favicon');
  if (!hasRobots) issues.push('Missing robots.txt');
  
  if (issues.length > 0) {
    throw new Error(`Static asset issues: ${issues.join(', ')}`);
  }
  
  // Check for image files and their optimization
  const imageExts = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
  const imageFiles = items.filter(item => 
    !item.isDirectory() && 
    imageExts.some(ext => item.name.toLowerCase().endsWith(ext))
  );
  
  return `Static assets are properly configured. Found ${imageFiles.length} image files.`;
}

// ==============================================================
// 2. CODE QUALITY TESTS
// ==============================================================

async function testTypeScriptCompilation() {
  try {
    // Run TypeScript type checking without emitting files
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    return 'TypeScript compilation successful. No type errors found.';
  } catch (error) {
    const output = error.stdout ? error.stdout.toString() : error.message;
    throw new Error(`TypeScript compilation failed: ${output.split('\\n')[0]}`);
  }
}

async function testLinting() {
  try {
    // Run ESLint to check code quality
    execSync('npx eslint src --ext .ts,.tsx', { stdio: 'pipe' });
    return 'ESLint check successful. No linting errors found.';
  } catch (error) {
    const output = error.stdout ? error.stdout.toString() : error.message;
    throw new Error(`ESLint check failed: ${output.split('\\n')[0]}`);
  }
}

async function testComponentStructure() {
  const componentsDir = path.join(__dirname, 'src', 'components');
  const componentDirs = (await fs.readdir(componentsDir, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(componentsDir, dirent.name));
  
  const missingIndexFiles = [];
  
  for (const dir of componentDirs) {
    const files = await fs.readdir(dir);
    const hasIndexFile = files.some(file => file === 'index.ts' || file === 'index.tsx');
    
    if (!hasIndexFile) {
      missingIndexFiles.push(path.relative(__dirname, dir));
    }
  }
  
  if (missingIndexFiles.length > 0) {
    throw new Error(`Found ${missingIndexFiles.length} component directories without index files: ${missingIndexFiles.join(', ')}`);
  }
  
  return `All ${componentDirs.length} component directories have proper index files for exports.`;
}

// ==============================================================
// 3. BUILD TESTS
// ==============================================================

async function testDevBuild() {
  try {
    // Run a development build
    execSync('npm run build:dev', { stdio: 'pipe' });
    
    // Check if dist directory was created
    const distExists = await checkFileExists(path.join(__dirname, 'dist'));
    
    if (!distExists) {
      throw new Error('Build completed but dist directory was not created');
    }
    
    return 'Development build completed successfully. Dist directory created.';
  } catch (error) {
    const output = error.stdout ? error.stdout.toString() : error.message;
    throw new Error(`Development build failed: ${output.split('\\n')[0]}`);
  }
}

async function testProductionBuild() {
  try {
    // Run a production build
    execSync('npm run build', { stdio: 'pipe' });
    
    // Check if dist directory was created and contains expected files
    const distDir = path.join(__dirname, 'dist');
    const distExists = await checkFileExists(distDir);
    
    if (!distExists) {
      throw new Error('Build completed but dist directory was not created');
    }
    
    // Check for critical files in the dist directory
    const files = await fs.readdir(distDir);
    const hasIndex = files.some(file => file === 'index.html');
    const hasAssets = files.some(file => file === 'assets' || file.startsWith('assets'));
    
    if (!hasIndex || !hasAssets) {
      throw new Error('Build output is missing critical files');
    }
    
    return 'Production build completed successfully. All expected output files are present.';
  } catch (error) {
    const output = error.stdout ? error.stdout.toString() : error.message;
    throw new Error(`Production build failed: ${output.split('\\n')[0]}`);
  }
}

// ==============================================================
// 4. FRONTEND COMPONENT TESTS
// ==============================================================

async function testComponentRenders() {
  const componentsDir = path.join(__dirname, 'src', 'components');
  
  // Get all component directories
  const componentDirs = (await fs.readdir(componentsDir, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Get a list of all component files
  const componentFiles = [];
  for (const dir of componentDirs) {
    const dirPath = path.join(componentsDir, dir);
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      if (file.endsWith('.tsx') && !file.endsWith('test.tsx')) {
        componentFiles.push({
          dir,
          file,
          path: path.join(dirPath, file)
        });
      }
    }
  }
  
  // For each component, do a basic check that it exports something
  // This is a basic test, ideally you'd use a test framework like Jest
  const results = {};
  
  for (const component of componentFiles) {
    try {
      const content = await fs.readFile(component.path, 'utf8');
      
      // Check if it's a React component
      const hasReactImport = content.includes('import React') || 
                            content.includes('from "react"') || 
                            content.includes('from \'react\'');
      
      // Check if it exports something
      const hasExport = content.includes('export ');
      
      // Check if it has a proper return statement
      const hasJSX = content.includes('return (') && content.includes('<');
      
      if (hasReactImport && hasExport && hasJSX) {
        results[component.path] = 'VALID';
      } else {
        results[component.path] = 'POTENTIALLY INVALID:' + 
          (!hasReactImport ? ' No React import.' : '') +
          (!hasExport ? ' No export.' : '') +
          (!hasJSX ? ' No JSX return.' : '');
      }
    } catch (error) {
      results[component.path] = `ERROR: ${error.message}`;
    }
  }
  
  // Count valid vs invalid components
  const validCount = Object.values(results).filter(r => r === 'VALID').length;
  const invalidCount = componentFiles.length - validCount;
  
  if (invalidCount > 0) {
    const invalidComponents = Object.entries(results)
      .filter(([_, status]) => status !== 'VALID')
      .map(([path, status]) => `${path.replace(__dirname, '')}: ${status}`);
    
    throw new Error(`Found ${invalidCount} potentially invalid components: ${invalidComponents.join(', ')}`);
  }
  
  return `All ${validCount} components appear to be valid React components with proper exports.`;
}

// ==============================================================
// 5. PERFORMANCE TESTS
// ==============================================================

async function testBundleSize() {
  try {
    // Ensure a production build exists
    const distDir = path.join(__dirname, 'dist');
    const distExists = await checkFileExists(distDir);
    
    if (!distExists) {
      throw new Error('Dist directory not found. Run a production build first.');
    }
    
    // Get size of assets directory
    const assetsDir = path.join(distDir, 'assets');
    const assetFiles = await fs.readdir(assetsDir);
    
    let totalSize = 0;
    let largestFiles = [];
    
    for (const file of assetFiles) {
      const filePath = path.join(assetsDir, file);
      const stats = await fs.stat(filePath);
      totalSize += stats.size;
      
      largestFiles.push({
        name: file,
        size: stats.size
      });
    }
    
    // Sort by size (descending) and take top 5
    largestFiles.sort((a, b) => b.size - a.size);
    largestFiles = largestFiles.slice(0, 5);
    
    // Calculate sizes in KB and MB
    const totalSizeKB = (totalSize / 1024).toFixed(2);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    // Evaluate bundle size (general guideline: main bundle < 250KB is good)
    const isGoodSize = totalSize < 500 * 1024; // Less than 500KB total is good
    
    if (!isGoodSize) {
      throw new Error(`Bundle size is ${totalSizeMB}MB (${totalSizeKB}KB), which is larger than recommended. Consider code-splitting or tree-shaking to reduce size.`);
    }
    
    return `Bundle size is ${totalSizeMB}MB (${totalSizeKB}KB), which is acceptable. Largest files: ${largestFiles.map(f => `${f.name}: ${(f.size/1024).toFixed(2)}KB`).join(', ')}`;
  } catch (error) {
    throw error;
  }
}

// ==============================================================
// 6. SEO TESTS
// ==============================================================

async function testSEOElements() {
  try {
    // Check if we have a sitemap
    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
    const sitemapExists = await checkFileExists(sitemapPath);
    
    // Check if we have a robots.txt
    const robotsPath = path.join(__dirname, 'public', 'robots.txt');
    const robotsExists = await checkFileExists(robotsPath);
    
    // Check for SEO components in codebase
    const srcPath = path.join(__dirname, 'src');
    const hasTitle = await grepInFiles(srcPath, '<title');
    const hasMeta = await grepInFiles(srcPath, '<meta');
    const hasHelmet = await grepInFiles(srcPath, 'react-helmet');
    
    const issues = [];
    if (!sitemapExists) issues.push('No sitemap.xml found');
    if (!robotsExists) issues.push('No robots.txt found');
    if (!hasTitle && !hasHelmet) issues.push('No title tags or React Helmet usage found');
    if (!hasMeta && !hasHelmet) issues.push('No meta tags or React Helmet usage found');
    
    if (issues.length > 0) {
      throw new Error(`SEO issues found: ${issues.join(', ')}`);
    }
    
    return `SEO elements are properly configured. Found sitemap: ${sitemapExists}, robots.txt: ${robotsExists}, title tags: ${hasTitle || hasHelmet}, meta tags: ${hasMeta || hasHelmet}`;
  } catch (error) {
    throw error;
  }
}

// Helper function to grep in files
async function grepInFiles(directory, searchText) {
  try {
    const result = execSync(`grep -r "${searchText}" ${directory} --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"`, 
      { stdio: 'pipe', encoding: 'utf-8' });
    return result && result.length > 0;
  } catch (error) {
    // grep returns exit code 1 if no matches found
    return false;
  }
}

// ==============================================================
// 7. SECURITY TESTS
// ==============================================================

async function testEnvVariables() {
  // Check if sensitive values are exposed in the code
  const sensitivePatterns = [
    'api_key',
    'apikey',
    'password',
    'secret',
    'supabase_url',
    'supabase_key',
    'connection_string'
  ];
  
  const srcPath = path.join(__dirname, 'src');
  let exposed = [];
  
  for (const pattern of sensitivePatterns) {
    try {
      const result = execSync(`grep -r "${pattern}" ${srcPath} --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js"`, 
        { stdio: 'pipe', encoding: 'utf-8' });
      
      if (result && result.length > 0) {
        // Exclude patterns that are likely safe (e.g. from environment variables)
        if (!result.includes('process.env') && !result.includes('import.meta.env')) {
          exposed.push(pattern);
        }
      }
    } catch (error) {
      // grep returns exit code 1 if no matches found - this is good
    }
  }
  
  if (exposed.length > 0) {
    throw new Error(`Potentially exposed sensitive data found in code: ${exposed.join(', ')}`);
  }
  
  return 'No exposed sensitive data found in the codebase.';
}

// ==============================================================
// RUN ALL TESTS
// ==============================================================

async function runAllTests() {
  console.log('\n========================================');
  console.log('🧪 AG HANDLOOM E-COMMERCE TEST SUITE 🧪');
  console.log('========================================\n');
  
  // 1. File Structure Tests
  await runTest(TEST_CATEGORIES.STRUCTURE, 'Project Directory Structure', testProjectStructure);
  await runTest(TEST_CATEGORIES.STRUCTURE, 'Environment Files', testEnvFiles);
  await runTest(TEST_CATEGORIES.STRUCTURE, 'Static Assets', testStaticAssets);
  
  // 2. Code Quality Tests
  await runTest(TEST_CATEGORIES.CODE_QUALITY, 'TypeScript Compilation', testTypeScriptCompilation);
  await runTest(TEST_CATEGORIES.CODE_QUALITY, 'ESLint Code Quality', testLinting);
  await runTest(TEST_CATEGORIES.CODE_QUALITY, 'Component Structure', testComponentStructure);
  
  // 3. Build Tests
  await runTest(TEST_CATEGORIES.BUILD, 'Development Build', testDevBuild);
  await runTest(TEST_CATEGORIES.BUILD, 'Production Build', testProductionBuild);
  
  // 4. Frontend Component Tests
  await runTest(TEST_CATEGORIES.FRONTEND, 'Component Structure Testing', testComponentRenders);
  
  // 5. Performance Tests
  await runTest(TEST_CATEGORIES.PERFORMANCE, 'Bundle Size Analysis', testBundleSize);
  
  // 6. SEO Tests
  await runTest(TEST_CATEGORIES.SEO, 'SEO Elements', testSEOElements);
  
  // 7. Security Tests
  await runTest(TEST_CATEGORIES.SECURITY, 'Environment Variables Security', testEnvVariables);
  
  // Print summary
  console.log('\n========================================');
  console.log('📊 TEST RESULTS SUMMARY 📊');
  console.log('========================================');
  console.log(`Total tests: ${testResults.passed + testResults.failed + testResults.skipped}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`⏭️ Skipped: ${testResults.skipped}`);
  console.log('========================================');
  
  // Print failures
  if (testResults.failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.details
      .filter(test => test.status === 'FAILED')
      .forEach(test => {
        console.log(`- ${test.category}: ${test.name}`);
        console.log(`  Error: ${test.error}`);
      });
  }
  
  console.log('\n✨ Test suite completed ✨');
}

// Run the tests
runAllTests();
