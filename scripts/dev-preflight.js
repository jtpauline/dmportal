#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clean build directories to prevent stale files
function cleanBuildDirectories() {
  const directories = [
    path.resolve(process.cwd(), 'public/build'),
    path.resolve(process.cwd(), 'build'),
    path.resolve(process.cwd(), '.cache')
  ];

  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
    fs.mkdirSync(dir);
  });

  console.log('✅ Build directories cleaned');
}

// Check for potential configuration issues
async function checkRemixConfiguration() {
  const configPath = path.resolve(process.cwd(), 'remix.config.js');
  
  try {
    const config = await import(configPath);
    const resolvedConfig = config.default || config;

    const obsoleteFlags = [
      'v2_errorBoundary',
      'v2_headers', 
      'v2_meta', 
      'v2_normalizeFormMethod', 
      'v2_routeConvention',
      'v2_dev'
    ];

    obsoleteFlags.forEach(flag => {
      if (resolvedConfig.future && resolvedConfig.future[flag]) {
        console.warn(`⚠️ Obsolete flag detected: ${flag}`);
      }
    });
  } catch (error) {
    console.error('Error reading configuration:', error);
  }
}

async function main() {
  try {
    cleanBuildDirectories();
    await checkRemixConfiguration();
  } catch (error) {
    console.error('Preflight check failed:', error);
    process.exit(1);
  }
}

main();
