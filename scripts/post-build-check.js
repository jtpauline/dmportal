#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

function checkBuildOutputIntegrity() {
  const buildDir = path.join(process.cwd(), 'build');
  const publicBuildDir = path.join(process.cwd(), 'public', 'build');

  try {
    // Check build directory exists and is not empty
    if (!fs.existsSync(buildDir) || fs.readdirSync(buildDir).length === 0) {
      console.error('❌ Build directory is empty or missing');
      process.exit(1);
    }

    // Check public build directory exists and is not empty
    if (!fs.existsSync(publicBuildDir) || fs.readdirSync(publicBuildDir).length === 0) {
      console.error('❌ Public build directory is empty or missing');
      process.exit(1);
    }

    // Additional integrity checks
    const manifestPath = path.join(buildDir, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
      console.error('❌ Build manifest is missing');
      process.exit(1);
    }

    console.log('✅ Build output integrity check passed');
  } catch (error) {
    console.error('❌ Build integrity check failed:', error);
    process.exit(1);
  }
}

function main() {
  console.log('🔍 Performing post-build integrity check');
  checkBuildOutputIntegrity();
}

main();
