#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function safeExec(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8', 
      stdio: 'pipe',
      ...options 
    }).trim();
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return null;
  }
}

function deepDiagnostic() {
  console.log('🔬 Comprehensive Remix Vite Package Diagnostic');

  // Check Remix-related packages
  const remixPackages = [
    '@remix-run/node',
    '@remix-run/react', 
    '@remix-run/dev',
    '@remix-run/vite'
  ];

  console.log('\n📦 Package Availability Check:');
  remixPackages.forEach(pkg => {
    try {
      const version = safeExec(`npm view ${pkg} version`);
      console.log(`${pkg}: ${version ? '✅ Available' : '❌ Not Found'}`);
    } catch (error) {
      console.log(`${pkg}: ❌ Not Found`);
    }
  });

  // Detailed package investigation
  console.log('\n🕵️ Detailed Package Investigation:');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    console.log('Current package.json dependencies:');
    console.log(JSON.stringify(packageJson.dependencies, null, 2));
    console.log('\nCurrent package.json devDependencies:');
    console.log(JSON.stringify(packageJson.devDependencies, null, 2));
  } catch (error) {
    console.error('❌ Unable to read package.json');
  }

  // Check Remix documentation recommended approach
  console.log('\n📝 Recommended Installation Strategy:');
  console.log('1. Verify Remix documentation for latest package configuration');
  console.log('2. Consider using @remix-run/dev with Vite plugin');
  console.log('3. Check for any recent package restructuring');

  // System environment check
  console.log('\n💻 System Environment:');
  try {
    const nodeVersion = safeExec('node --version');
    const npmVersion = safeExec('npm --version');
    console.log(`Node.js Version: ${nodeVersion}`);
    console.log(`NPM Version: ${npmVersion}`);
  } catch (error) {
    console.error('❌ Unable to retrieve system versions');
  }
}

deepDiagnostic();
