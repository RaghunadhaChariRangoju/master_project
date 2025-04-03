// Simple sitemap generator script for AG Handloom E-commerce
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define your website URL
const siteUrl = 'https://your-production-domain.com'; // Replace with your actual domain

// Define your routes
const routes = [
  '/',
  '/shop',
  '/about',
  '/contact',
  '/collections',
  '/checkout',
  '/profile',
  '/orders',
  // Add more static routes here
];

// Generate the sitemap XML
const generateSitemap = () => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(route => {
    return `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>
`;

  // Write sitemap to public directory
  const publicDir = path.resolve(__dirname, '../public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
};

// Run the sitemap generator
generateSitemap();
