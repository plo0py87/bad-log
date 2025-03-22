// fix-paths.js
import fs from 'fs';
import path from 'path';

console.log('Fixing asset paths in built files...');

// Read the index.html file
const indexPath = path.resolve('./dist/index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative ones
indexContent = indexContent.replace(/src="\/react-blog\//g, 'src="./');
indexContent = indexContent.replace(/href="\/react-blog\//g, 'href="./');

// Write the fixed content back
fs.writeFileSync(indexPath, indexContent);

// Create proper _headers file
const headersContent = `/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
`;
fs.writeFileSync('./dist/_headers', headersContent);

// Create proper _redirects file
const redirectsContent = '/* /index.html 200';
fs.writeFileSync('./dist/_redirects', redirectsContent);

console.log('Fixed asset paths and created Netlify configuration files.');
