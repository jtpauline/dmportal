#!/usr/bin/env node

import { execSync } from 'child_process';
import https from 'https';

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

function checkPackageAvailability(packageName) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'registry.npmjs.org',
      path: `/${packageName.replace('/', '%2f')}`,
      method: 'HEAD'
    };

    const req = https.request(options, (res) => {
      console.log(`📦 Package ${packageName} Status: ${res.statusCode}`);
      resolve(res.statusCode === 200);
    });

    req.on('error', (error) => {
      console.error(`🚨 Network Error: ${error.message}`);
      reject(error);
    });

    req.end();
  });
}

async function remixPackageResolver() {
  console.log('🔍 Remix Package Resolution Diagnostic');

  // Current Registry Check
  const currentRegistry = safeExec('npm config get registry');
  console.log(`📡 Current Registry: ${currentRegistry}`);

  // Remix Packages to Check
  const remixPackages = [
    '@remix-run/node',
    '@remix-run/react', 
    '@remix-run/dev', 
    '@remix-run/vite'
  ];

  console.log('\n🕵️ Package Availability Check:');
  for (const pkg of remixPackages) {
    try {
      const available = await checkPackageAvailability(pkg);
      console.log(`${pkg}: ${available ? '✅ Available' : '❌ Not Found'}`);
    } catch (error) {
      console.error(`Error checking ${pkg}: ${error.message}`);
    }
  }

  // Alternative Resolution Strategies
  console.log('\n🔧 Resolution Strategies:');
  
  // Strategy 1: Direct Version Query
  console.log('Strategy 1: Direct Version Query');
  try {
    const versionsCommand = `npm view @remix-run/vite versions --json`;
    const versions = safeExec(versionsCommand);
    console.log('Available Versions:', versions || 'No versions found');
  } catch (error) {
    console.error('❌ Version Query Failed');
  }

  // Strategy 2: NPM Cache Verification
  console.log('\nStrategy 2: NPM Cache Verification');
  safeExec('npm cache verify');

  // Strategy 3: Alternative Registry
  console.log('\nStrategy 3: Alternative Registry Check');
  const alternativeRegistries = [
    'https://registry.npmjs.cf/',
    'https://registry.yarnpkg.com/'
  ];

  for (const registry of alternativeRegistries) {
    console.log(`Checking Registry: ${registry}`);
    safeExec(`npm config set registry ${registry}`);
    
    try {
      const checkVersion = safeExec('npm view @remix-run/vite version');
      console.log(`Version from ${registry}: ${checkVersion || 'Not Found'}`);
    } catch (error) {
      console.error(`Failed to query ${registry}`);
    }
  }

  // Restore Original Registry
  safeExec('npm config set registry https://registry.npmjs.org/');
}

remixPackageResolver();
