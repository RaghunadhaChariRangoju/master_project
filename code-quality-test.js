// Code Quality and Structure Test Script
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running Code Quality and Structure Tests...');
console.log('-'.repeat(60));

// Constants
const ROOT_DIR = path.resolve('.');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Test 1: Check for TypeScript errors
console.log('Test 1: Checking for TypeScript compilation errors...');
try {
  execSync('npx tsc --noEmit', { encoding: 'utf8' });
  console.log('✓ TypeScript compilation successful');
} catch (error) {
  console.log('✗ TypeScript compilation failed:');
  console.log(error.stdout.slice(0, 2000) + '...');
}

// Test 2: Run ESLint to check for code quality issues
console.log('\nTest 2: Running ESLint to check code quality...');
try {
  execSync('npx eslint src --ext .ts,.tsx --max-warnings=0', { encoding: 'utf8' });
  console.log('✓ ESLint found no issues');
} catch (error) {
  console.log('✗ ESLint found issues:');
  console.log(error.stdout.slice(0, 2000) + '...');
}

// Test 3: Check for unused dependencies
console.log('\nTest 3: Checking for unused dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const dependencyList = Object.keys(dependencies);
  
  // Get all import statements from TS/TSX files
  let imports = [];
  const findImports = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        findImports(filePath);
      } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const importMatches = content.match(/from\s+['"]([^'"/][^'"]*)['"]/g) || [];
        imports = imports.concat(importMatches.map(match => {
          const importPath = match.match(/from\s+['"]([^'"/][^'"]*)['"]/)[1];
          return importPath.split('/')[0];
        }));
      }
    }
  };
  
  findImports(SRC_DIR);
  
  // Filter out relative imports and standard libraries
  const externalImports = imports.filter(imp => 
    !imp.startsWith('.') && 
    !imp.startsWith('@/') && 
    !['react', 'node'].includes(imp)
  );
  
  // Find unique imports
  const uniqueImports = [...new Set(externalImports)];
  
  // Find potentially unused dependencies
  const unusedDependencies = dependencyList.filter(dep => {
    // Skip dependencies that are used indirectly or are development tools
    const skipList = [
      'typescript', 'vite', 'eslint', 'tailwindcss', 'postcss', 'autoprefixer',
      '@types', '@vitejs', '@eslint', 'typescript-eslint'
    ];
    
    if (skipList.some(skip => dep.startsWith(skip))) {
      return false;
    }
    
    // Normalize dependency name for comparison
    const normalizedDep = dep.replace('@', '').replace(/\/.*$/, '');
    return !uniqueImports.some(imp => imp.includes(normalizedDep));
  });
  
  if (unusedDependencies.length > 0) {
    console.log(`Found ${unusedDependencies.length} potentially unused dependencies:`);
    unusedDependencies.forEach(dep => console.log(`  - ${dep}`));
  } else {
    console.log('✓ No potentially unused dependencies found');
  }
} catch (error) {
  console.log('✗ Error checking dependencies:', error.message);
}

// Test 4: Check for file structure consistency
console.log('\nTest 4: Checking file structure consistency...');
try {
  const checkComponentStructure = (dir) => {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let hasIndexFile = false;
    
    for (const file of files) {
      if (file.name === 'index.ts' || file.name === 'index.tsx') {
        hasIndexFile = true;
        break;
      }
    }
    
    return hasIndexFile;
  };
  
  const componentsDir = path.join(SRC_DIR, 'components');
  const componentSubdirs = fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => path.join(componentsDir, dirent.name));
  
  const missingIndexDirs = componentSubdirs.filter(dir => !checkComponentStructure(dir));
  
  if (missingIndexDirs.length > 0) {
    console.log('✗ Found component directories without index files:');
    missingIndexDirs.forEach(dir => console.log(`  - ${dir}`));
  } else {
    console.log('✓ All component directories have proper index files');
  }
  
} catch (error) {
  console.log('✗ Error checking file structure:', error.message);
}

// Test 5: Check for missing type definitions
console.log('\nTest 5: Checking for missing type definitions...');
try {
  const findAnyType = (dir) => {
    let anyCount = 0;
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        anyCount += findAnyType(filePath);
      } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        // Count any types (but avoid false positives in comments and strings)
        const matches = content.match(/(?<!\/\/.*): any(?!.*['"])/g);
        if (matches) {
          console.log(`  - Found ${matches.length} 'any' types in ${filePath}`);
          anyCount += matches.length;
        }
      }
    }
    
    return anyCount;
  };
  
  const anyTypeCount = findAnyType(SRC_DIR);
  
  if (anyTypeCount > 0) {
    console.log(`✗ Found ${anyTypeCount} 'any' type usages that should be properly typed`);
  } else {
    console.log('✓ No untyped "any" usages found');
  }
  
} catch (error) {
  console.log('✗ Error checking type definitions:', error.message);
}

console.log('-'.repeat(60));
console.log('Code Quality Tests Completed');
