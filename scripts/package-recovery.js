#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function analyzePackageRemoval() {
  console.log('🔍 Analyzing Package Removal Impact');

  // Read original package.json
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  // Core dependencies we absolutely need
  const criticalDependencies = [
    '@remix-run/node',
    '@remix-run/react',
    '@remix-run/dev',
    'react',
    'react-dom',
    'vite',
    'typescript',
    'tailwindcss'
  ];

  console.log('\n🚨 Checking Critical Dependencies:');
  
  criticalDependencies.forEach(dep => {
    const isInstalled = packageContent.dependencies?.[dep] || 
                        packageContent.devDependencies?.[dep];
    
    console.log(`${dep}: ${isInstalled ? '✅ Present' : '❌ MISSING'}`);
  });

  console.log('\n🔧 Recommended Recovery Steps:');
  console.log('1. Run: npm install');
  console.log('2. Verify dependencies with: npm ls');
}

function recoverDependencies() {
  try {
    console.log('\n🔄 Attempting Dependency Recovery');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies Reinstalled Successfully');
  } catch (error) {
    console.error('❌ Dependency Recovery Failed:', error);
  }
}

function main() {
  analyzePackageRemoval();
  recoverDependencies();
}

main();
