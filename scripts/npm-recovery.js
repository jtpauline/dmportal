#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

function npmRecoveryProcedure() {
  console.log('🔧 Comprehensive NPM Recovery');

  // Validate Node.js and NPM versions
  console.log('\n🌐 System Compatibility Check:');
  const nodeVersion = safeExec('node --version');
  const npmVersion = safeExec('npm --version');
  
  console.log(`Node.js Version: ${nodeVersion || 'Unknown'}`);
  console.log(`NPM Version: ${npmVersion || 'Unknown'}`);

  // Detailed package.json validation
  const packagePath = path.join(process.cwd(), 'package.json');
  try {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    console.log('\n📦 Dependency Validation:');
    console.log('Checking package compatibility...');
    
    // Validate Remix dependencies
    const remixDeps = [
      '@remix-run/node', 
      '@remix-run/react', 
      '@remix-run/dev', 
      '@remix-run/vite'
    ];
    
    remixDeps.forEach(dep => {
      const version = packageContent.dependencies?.[dep] || 
                     packageContent.devDependencies?.[dep];
      console.log(`${dep}: ${version || 'Not Found ⚠️'}`);
    });
  } catch (error) {
    console.error('❌ Package.json Validation Failed:', error.message);
  }

  // NPM Configuration Reset
  console.log('\n🔧 NPM Configuration Reset:');
  safeExec('npm config set registry https://registry.npmjs.org/');
  
  // Clear NPM Cache
  console.log('Clearing NPM Cache...');
  safeExec('npm cache clean --force');

  // Generate Comprehensive .npmrc
  const npmrcContent = `
registry=https://registry.npmjs.org/
strict-ssl=false
timeout=600000
fetch-retries=3
prefer-offline=true
loglevel=error
`;
  
  fs.writeFileSync(path.join(process.cwd(), '.npmrc'), npmrcContent);
  console.log('✅ .npmrc Configuration Updated');

  // Dependency Resolution Strategy
  console.log('\n🔍 Dependency Resolution:');
  console.log('Attempting to resolve package versions...');
  
  // Attempt to resolve specific problematic package
  try {
    const resolveCommand = 'npm view @remix-run/vite versions --json';
    const versions = safeExec(resolveCommand);
    console.log('Available Remix Vite Versions:', versions || 'Resolution Failed');
  } catch (error) {
    console.error('❌ Version Resolution Failed:', error.message);
  }
}

npmRecoveryProcedure();
