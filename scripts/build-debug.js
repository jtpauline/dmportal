#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function checkDiskSpace() {
  try {
    const output = execSync('df -h').toString();
    console.log('Disk Space:\n', output);
  } catch (error) {
    console.error('Could not check disk space:', error);
  }
}

function checkFilePermissions() {
  const projectRoot = process.cwd();
  const criticalDirs = [
    'build',
    'public/build',
    '.cache',
    'node_modules'
  ];

  criticalDirs.forEach(dir => {
    const fullPath = path.join(projectRoot, dir);
    try {
      fs.accessSync(fullPath, fs.constants.R_OK | fs.constants.W_OK);
      console.log(`✅ Permissions OK for: ${dir}`);
    } catch (error) {
      console.error(`❌ Permission issue with: ${dir}`, error);
    }
  });
}

function cleanBuildArtifacts() {
  const artifactDirs = [
    'build',
    'public/build',
    '.cache',
    'node_modules/.cache'
  ];

  artifactDirs.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    try {
      if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
        console.log(`🧹 Cleaned: ${dir}`);
      }
    } catch (error) {
      console.error(`Error cleaning ${dir}:`, error);
    }
  });
}

function runNpmCache() {
  try {
    execSync('npm cache clean --force', { stdio: 'inherit' });
    console.log('✅ NPM cache cleaned');
  } catch (error) {
    console.error('❌ NPM cache clean failed:', error);
  }
}

function main() {
  console.log('🔍 Starting Diagnostic Build Process');
  
  checkDiskSpace();
  checkFilePermissions();
  cleanBuildArtifacts();
  runNpmCache();

  console.log('🚀 Attempting Rebuild');
  try {
    execSync('npm run build', { 
      stdio: 'inherit',
      maxBuffer: 1024 * 1024 * 10  // Increase buffer to 10MB
    });
    console.log('✅ Build Successful');
  } catch (error) {
    console.error('❌ Build Failed:', error);
    process.exit(1);
  }
}

main();
