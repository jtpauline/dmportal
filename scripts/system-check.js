#!/usr/bin/env node

import os from 'os';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function systemDiagnostics() {
  console.log('🖥️ System Diagnostics Report');
  console.log('----------------------------');
  
  // Node.js and NPM Versions
  try {
    const nodeVersion = process.version;
    const npmVersion = execSync('npm --version').toString().trim();
    console.log(`Node.js Version: ${nodeVersion}`);
    console.log(`NPM Version: ${npmVersion}`);
  } catch (error) {
    console.error('❌ Error checking Node.js/NPM versions:', error);
  }

  // System Resources
  console.log('\n💻 System Resources:');
  console.log(`Total Memory: ${Math.round(os.totalmem() / (1024 * 1024 * 1024))} GB`);
  console.log(`Free Memory: ${Math.round(os.freemem() / (1024 * 1024 * 1024))} GB`);
  console.log(`CPU Cores: ${os.cpus().length}`);

  // Project Directory Check
  console.log('\n📂 Project Directory:');
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
      const stats = fs.statSync(fullPath);
      console.log(`${dir}: 
        Exists: ✅
        Size: ${Math.round(stats.size / (1024 * 1024))} MB
        Last Modified: ${stats.mtime}`);
    } catch (error) {
      console.log(`${dir}: ❌ Not found or inaccessible`);
    }
  });

  // Dependency Integrity
  console.log('\n🔍 Dependency Integrity:');
  try {
    const packageLock = path.join(projectRoot, 'package-lock.json');
    if (fs.existsSync(packageLock)) {
      const lockStats = fs.statSync(packageLock);
      console.log(`Package Lock File: ✅ 
        Last Updated: ${lockStats.mtime}`);
    } else {
      console.warn('⚠️ package-lock.json is missing');
    }
  } catch (error) {
    console.error('❌ Error checking package lock:', error);
  }
}

// Run diagnostics
systemDiagnostics();
