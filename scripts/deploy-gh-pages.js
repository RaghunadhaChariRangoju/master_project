// GitHub Pages deployment script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure dist directory exists
const distPath = path.resolve(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  console.error('Dist directory does not exist! Run build first.');
  process.exit(1);
}

// Create .nojekyll file to prevent GitHub Pages from ignoring files that begin with an underscore
fs.writeFileSync(path.join(distPath, '.nojekyll'), '');

// Create CNAME file if you have a custom domain
// fs.writeFileSync(path.join(distPath, 'CNAME'), 'your-domain.com');

try {
  // Initialize git in the dist directory
  execSync('git init', { cwd: distPath });
  
  // Add all files
  execSync('git add -A', { cwd: distPath });
  
  // Commit
  execSync('git commit -m "Deploy to GitHub Pages"', { cwd: distPath });
  
  // Force push to the gh-pages branch of your repository
  // Replace with your actual GitHub repository URL
  execSync('git push -f https://github.com/YOUR_USERNAME/ag-handloom.git main:gh-pages', { cwd: distPath });
  
  console.log('Successfully deployed to GitHub Pages!');
} catch (error) {
  console.error('Deployment failed:', error);
}
