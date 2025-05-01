// fix-paths.js
import fs from 'fs';
import path from 'path';

console.log('Preparing files for Netlify deployment...');

// Read the index.html file
const indexPath = path.resolve('./dist/index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Only replace paths if they contain the specific pattern
// This is now more conditional to avoid breaking working paths
if (indexContent.includes('/react-blog/')) {
  // Replace absolute paths with relative ones
  indexContent = indexContent.replace(/src="\/react-blog\//g, 'src="./');
  indexContent = indexContent.replace(/href="\/react-blog\//g, 'href="./');
  
  // Write the fixed content back
  fs.writeFileSync(indexPath, indexContent);
  console.log('Fixed asset paths in index.html');
} else {
  console.log('No path fixes needed in index.html');
}

// Create proper _headers file - this will override the one in your public folder
const headersContent = `/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
`;
fs.writeFileSync('./dist/_headers', headersContent);

// Create proper _redirects file - this will override the one in your public folder
const redirectsContent = '/* /index.html 200';
fs.writeFileSync('./dist/_redirects', redirectsContent);

console.log('Created Netlify configuration files.');
