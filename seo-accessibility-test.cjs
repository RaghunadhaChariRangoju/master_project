// SEO and Accessibility Test for AG Handloom E-commerce
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');

// Configuration
const SRC_DIR = path.join(__dirname, 'src');
const PUBLIC_DIR = path.join(__dirname, 'public');
const DIST_DIR = path.join(__dirname, 'dist');
const SERVER_URL = 'http://localhost:3000';

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

// Helper function to make HTTP request
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      timeout: 5000 // 5-second timeout
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
    
    req.end();
  });
}

// 1. SEO Tests

// Test 1.1: Check for sitemap.xml
function testSitemap() {
  const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  const distSitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  const exists = fileExists(sitemapPath) || fileExists(distSitemapPath);
  
  if (exists) {
    // Basic check of sitemap content
    try {
      let sitemapContent;
      if (fileExists(sitemapPath)) {
        sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      } else {
        sitemapContent = fs.readFileSync(distSitemapPath, 'utf8');
      }
      
      const hasUrlTags = sitemapContent.includes('<url>') && sitemapContent.includes('</url>');
      const hasLocTags = sitemapContent.includes('<loc>') && sitemapContent.includes('</loc>');
      
      if (hasUrlTags && hasLocTags) {
        recordTest('SEO', 'Sitemap Existence', true, {
          message: 'sitemap.xml exists and contains proper URL entries'
        });
      } else {
        recordTest('SEO', 'Sitemap Existence', false, {
          error: 'sitemap.xml exists but may be malformed, missing <url> or <loc> tags'
        });
      }
    } catch (error) {
      recordTest('SEO', 'Sitemap Existence', false, {
        error: `Error reading sitemap: ${error.message}`
      });
    }
  } else {
    recordTest('SEO', 'Sitemap Existence', false, {
      error: 'sitemap.xml not found in public or dist directory'
    });
  }
}

// Test 1.2: Check for robots.txt
function testRobotsTxt() {
  const robotsPath = path.join(PUBLIC_DIR, 'robots.txt');
  const distRobotsPath = path.join(DIST_DIR, 'robots.txt');
  const exists = fileExists(robotsPath) || fileExists(distRobotsPath);
  
  if (exists) {
    // Basic check of robots.txt content
    try {
      let robotsContent;
      if (fileExists(robotsPath)) {
        robotsContent = fs.readFileSync(robotsPath, 'utf8');
      } else {
        robotsContent = fs.readFileSync(distRobotsPath, 'utf8');
      }
      
      const hasUserAgent = robotsContent.toLowerCase().includes('user-agent');
      const hasSitemap = robotsContent.toLowerCase().includes('sitemap');
      
      recordTest('SEO', 'Robots.txt', true, {
        message: `robots.txt exists${!hasUserAgent ? ' but missing User-agent directive' : ''}${!hasSitemap ? ' and missing Sitemap directive' : ''}`
      });
    } catch (error) {
      recordTest('SEO', 'Robots.txt', false, {
        error: `Error reading robots.txt: ${error.message}`
      });
    }
  } else {
    recordTest('SEO', 'Robots.txt', false, {
      error: 'robots.txt not found in public or dist directory'
    });
  }
}

// Test 1.3: Check for SEO meta tags
async function testSeoMetaTags() {
  try {
    // First check if server is running
    try {
      const response = await makeRequest('/');
      if (response.statusCode !== 200) {
        recordTest('SEO', 'Meta Tags', false, {
          error: `Server returned status ${response.statusCode}, expected 200. Please start the development server.`
        });
        return;
      }
      
      const html = response.data;
      
      // Check for title tag
      const hasTitle = /<title[^>]*>([^<]+)<\/title>/i.test(html);
      
      // Check for meta description
      const hasMetaDescription = /<meta[^>]*name=["']description["'][^>]*>/i.test(html);
      
      // Check for viewport meta
      const hasViewport = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(html);
      
      // Check for canonical link
      const hasCanonical = /<link[^>]*rel=["']canonical["'][^>]*>/i.test(html);
      
      // Check for Open Graph tags
      const hasOgTags = /<meta[^>]*property=["']og:([^"']+)["'][^>]*>/i.test(html);
      
      const missingTags = [];
      if (!hasTitle) missingTags.push('title');
      if (!hasMetaDescription) missingTags.push('meta description');
      if (!hasViewport) missingTags.push('viewport meta');
      if (!hasCanonical) missingTags.push('canonical link');
      if (!hasOgTags) missingTags.push('Open Graph tags');
      
      if (missingTags.length === 0) {
        recordTest('SEO', 'Meta Tags', true, {
          message: 'All essential SEO meta tags are present'
        });
      } else {
        recordTest('SEO', 'Meta Tags', false, {
          error: `Missing important SEO tags: ${missingTags.join(', ')}`
        });
      }
    } catch (error) {
      recordTest('SEO', 'Meta Tags', false, {
        error: `Error making request to server: ${error.message}. Please start the development server.`
      });
    }
  } catch (error) {
    recordTest('SEO', 'Meta Tags', false, {
      error: error.message
    });
  }
}

// Test 1.4: Check for SEO-friendly URL structure
function testSeoFriendlyUrls() {
  try {
    // Check routing configuration in source files
    const routeFiles = findFiles(SRC_DIR, file => 
      file.includes('router') || 
      file.includes('routes') || 
      file.includes('App.tsx') || 
      file.includes('App.jsx') ||
      file.includes('main.tsx') ||
      file.includes('main.jsx')
    );
    
    if (routeFiles.length === 0) {
      recordTest('SEO', 'URL Structure', false, {
        error: 'Could not find routing configuration files'
      });
      return;
    }
    
    // Read the found files and check for route definitions
    let routeDefinitions = [];
    
    for (const file of routeFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Match Route components from react-router-dom
      const routeMatches = content.match(/<Route[^>]*path=["']([^"']+)["'][^>]*>/g) || [];
      
      for (const match of routeMatches) {
        const pathMatch = match.match(/path=["']([^"']+)["']/);
        if (pathMatch && pathMatch[1]) {
          routeDefinitions.push(pathMatch[1]);
        }
      }
    }
    
    // Analyze routes for SEO friendliness
    const badRoutes = routeDefinitions.filter(route => {
      // Check for query parameters in routes (not SEO friendly)
      if (route.includes('?')) return true;
      
      // Check for numeric IDs without slug
      if (route.match(/\/\:id$/) || route.match(/\/\:\w+Id$/)) return true;
      
      return false;
    });
    
    if (badRoutes.length > 0) {
      recordTest('SEO', 'URL Structure', false, {
        error: `Found ${badRoutes.length} potentially non-SEO-friendly routes: ${badRoutes.join(', ')}`
      });
    } else {
      recordTest('SEO', 'URL Structure', true, {
        message: `Found ${routeDefinitions.length} routes, all with SEO-friendly URL structure`
      });
    }
  } catch (error) {
    recordTest('SEO', 'URL Structure', false, {
      error: error.message
    });
  }
}

// 2. Accessibility Tests

// Test 2.1: Check for alt attributes on images
function testImageAltTags() {
  try {
    const componentFiles = findFiles(SRC_DIR, file => 
      file.endsWith('.tsx') || file.endsWith('.jsx')
    );
    
    let totalImages = 0;
    let imagesWithoutAlt = 0;
    let filesWithIssues = [];
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Find image tags in JSX
      const imgTags = content.match(/<img[^>]*>/g) || [];
      
      // Additional match for LazyLoadImage components
      const lazyLoadTags = content.match(/<LazyLoadImage[^>]*>/g) || [];
      
      const allImageTags = [...imgTags, ...lazyLoadTags];
      totalImages += allImageTags.length;
      
      // Check for alt attributes
      const imagesWithoutAltInFile = allImageTags.filter(
        img => !img.match(/alt=["'][^"']*["']/) && !img.match(/alt={[^}]*}/)
      );
      
      imagesWithoutAlt += imagesWithoutAltInFile.length;
      
      if (imagesWithoutAltInFile.length > 0) {
        filesWithIssues.push({
          file: path.relative(SRC_DIR, file),
          count: imagesWithoutAltInFile.length
        });
      }
    }
    
    if (filesWithIssues.length > 0) {
      recordTest('Accessibility', 'Image Alt Tags', false, {
        error: `Found ${imagesWithoutAlt} images without alt attributes out of ${totalImages} total images`,
        message: `Files with missing alt attributes: ${filesWithIssues.map(f => `${f.file} (${f.count})`).join(', ')}`
      });
    } else if (totalImages === 0) {
      recordTest('Accessibility', 'Image Alt Tags', true, {
        message: 'No image tags found in the codebase (test passed by default)'
      });
    } else {
      recordTest('Accessibility', 'Image Alt Tags', true, {
        message: `All ${totalImages} images have alt attributes`
      });
    }
  } catch (error) {
    recordTest('Accessibility', 'Image Alt Tags', false, {
      error: error.message
    });
  }
}

// Test 2.2: Check for semantic HTML elements
function testSemanticHtml() {
  try {
    const componentFiles = findFiles(SRC_DIR, file => 
      file.endsWith('.tsx') || file.endsWith('.jsx')
    );
    
    let semanticElements = {
      header: 0,
      footer: 0,
      main: 0,
      nav: 0,
      section: 0,
      article: 0,
      aside: 0
    };
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Count semantic elements
      for (const element of Object.keys(semanticElements)) {
        const regex = new RegExp(`<${element}[^>]*>`, 'g');
        const matches = content.match(regex) || [];
        semanticElements[element] += matches.length;
      }
    }
    
    // Check if essential semantic elements are used
    const essentialElements = ['header', 'footer', 'main', 'nav'];
    const missingElements = essentialElements.filter(e => semanticElements[e] === 0);
    
    if (missingElements.length > 0) {
      recordTest('Accessibility', 'Semantic HTML', false, {
        error: `Missing essential semantic HTML elements: ${missingElements.join(', ')}`,
        message: `Semantic element usage: ${Object.entries(semanticElements)
          .map(([element, count]) => `${element}: ${count}`)
          .join(', ')}`
      });
    } else {
      recordTest('Accessibility', 'Semantic HTML', true, {
        message: `All essential semantic HTML elements are used. Usage counts: ${Object.entries(semanticElements)
          .map(([element, count]) => `${element}: ${count}`)
          .join(', ')}`
      });
    }
  } catch (error) {
    recordTest('Accessibility', 'Semantic HTML', false, {
      error: error.message
    });
  }
}

// Test 2.3: Check for ARIA attributes and roles
function testAriaAttributes() {
  try {
    const componentFiles = findFiles(SRC_DIR, file => 
      file.endsWith('.tsx') || file.endsWith('.jsx')
    );
    
    let filesWithAria = 0;
    let totalAriaUsage = 0;
    let ariaAttributeCounts = {};
    
    for (const file of componentFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Match aria attributes
      const ariaMatches = content.match(/aria-[a-z]+=["'][^"']*["']|aria-[a-z]+={[^}]*}/g) || [];
      
      // Match role attributes
      const roleMatches = content.match(/role=["'][^"']*["']|role={[^}]*}/g) || [];
      
      const ariaCount = ariaMatches.length + roleMatches.length;
      
      if (ariaCount > 0) {
        filesWithAria++;
        totalAriaUsage += ariaCount;
        
        // Count individual aria attributes
        for (const match of ariaMatches) {
          const attrName = match.split('=')[0];
          ariaAttributeCounts[attrName] = (ariaAttributeCounts[attrName] || 0) + 1;
        }
        
        // Count roles
        for (const match of roleMatches) {
          ariaAttributeCounts['role'] = (ariaAttributeCounts['role'] || 0) + 1;
        }
      }
    }
    
    // ARIA is not mandatory on all elements, but its presence indicates attention to accessibility
    if (filesWithAria === 0) {
      recordTest('Accessibility', 'ARIA Attributes', false, {
        error: 'No ARIA attributes found in the codebase',
        message: 'Consider adding ARIA attributes and roles to improve accessibility'
      });
    } else {
      recordTest('Accessibility', 'ARIA Attributes', true, {
        message: `Found ARIA attributes in ${filesWithAria} files. Total usage: ${totalAriaUsage}. Most common: ${
          Object.entries(ariaAttributeCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([attr, count]) => `${attr} (${count})`)
            .join(', ')
        }`
      });
    }
  } catch (error) {
    recordTest('Accessibility', 'ARIA Attributes', false, {
      error: error.message
    });
  }
}

// Test 2.4: Check color contrast (basic code check)
function testColorContrast() {
  try {
    // Look for colors in CSS or Tailwind classes
    const cssFiles = findFiles(SRC_DIR, file => 
      file.endsWith('.css') || file.endsWith('.scss')
    );
    
    const tailwindConfigPath = path.join(__dirname, 'tailwind.config.js');
    const hasTailwindConfig = fileExists(tailwindConfigPath);
    
    // Check if using Tailwind's color palette (generally accessible)
    if (hasTailwindConfig) {
      try {
        const tailwindConfig = fs.readFileSync(tailwindConfigPath, 'utf8');
        const hasCustomColors = tailwindConfig.includes('colors:') || tailwindConfig.includes('theme: {');
        
        if (!hasCustomColors) {
          recordTest('Accessibility', 'Color Contrast', true, {
            message: 'Using Tailwind CSS default color palette, which generally has good contrast ratios'
          });
          return;
        }
      } catch (error) {
        // Continue to CSS analysis if tailwind config read fails
      }
    }
    
    // Very basic check for CSS color properties
    let suspiciousColorCombinations = 0;
    const lightColors = ['#fff', '#ffffff', 'white', 'rgb(255, 255, 255)', 'rgba(255, 255, 255', '#f', '#ff', '#fff'];
    const darkColors = ['#000', '#000000', 'black', 'rgb(0, 0, 0)', 'rgba(0, 0, 0'];
    
    for (const file of cssFiles) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for potentially low contrast combinations
      // This is a very primitive check and not a substitute for proper contrast analysis
      const lightBackgroundWithLightText = content.match(/background(-color)?:\s*(?:${lightColors.join('|')}).*color:\s*(?:${lightColors.join('|')})/);
      const darkBackgroundWithDarkText = content.match(/background(-color)?:\s*(?:${darkColors.join('|')}).*color:\s*(?:${darkColors.join('|')})/);
      
      if (lightBackgroundWithLightText || darkBackgroundWithDarkText) {
        suspiciousColorCombinations++;
      }
    }
    
    if (suspiciousColorCombinations > 0) {
      recordTest('Accessibility', 'Color Contrast', false, {
        error: `Found ${suspiciousColorCombinations} suspicious color combinations that may have poor contrast`,
        message: 'Consider using a color contrast checker tool for accurate assessment'
      });
    } else {
      recordTest('Accessibility', 'Color Contrast', true, {
        message: 'No obvious poor contrast combinations detected in CSS files (basic check only)'
      });
    }
  } catch (error) {
    recordTest('Accessibility', 'Color Contrast', false, {
      error: error.message
    });
  }
}

// Helper function to find files based on a predicate
function findFiles(directory, predicate) {
  const results = [];
  
  function traverse(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && file !== 'node_modules') {
        traverse(filePath);
      } else if (stat.isFile() && predicate(filePath)) {
        results.push(filePath);
      }
    }
  }
  
  traverse(directory);
  return results;
}

// Main function to run all tests
async function runSeoAndAccessibilityTests() {
  console.log('\n🧪 SEO AND ACCESSIBILITY TESTS 🧪');
  console.log('===============================================');
  
  // SEO Tests
  console.log('\n📊 Running SEO Tests...');
  testSitemap();
  testRobotsTxt();
  await testSeoMetaTags();
  testSeoFriendlyUrls();
  
  // Accessibility Tests
  console.log('\n♿ Running Accessibility Tests...');
  testImageAltTags();
  testSemanticHtml();
  testAriaAttributes();
  testColorContrast();
  
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
  
  console.log('\n✨ SEO and Accessibility testing completed ✨');
}

// Run the tests
runSeoAndAccessibilityTests();
