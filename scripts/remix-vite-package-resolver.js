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

function resolveRemixViteIntegration() {
  console.log('🔍 Remix Vite Package Resolution');

  // Clear npm cache
  console.log('🧹 Clearing NPM Cache');
  safeExec('npm cache clean --force');

  // Install dependencies with clean slate
  console.log('📦 Installing Dependencies');
  try {
    safeExec('npm install');
    console.log('✅ Dependencies Installed Successfully');
  } catch (error) {
    console.error('❌ Dependency Installation Failed');
    console.error(error.message);
    process.exit(1);
  }

  // Verify installation
  try {
    const installedPackages = [
      '@remix-run/node', 
      '@remix-run/react', 
      '@remix-run/dev',
      'vite'
    ];

    installedPackages.forEach(pkg => {
      try {
        const version = safeExec(`npm list ${pkg}`);
        console.log(`🔍 ${pkg} Version:`, version || 'Not Found');
      } catch (error) {
        console.error(`❌ Failed to check ${pkg}:`, error.message);
      }
    });
  } catch (error) {
    console.error('❌ Package Verification Failed');
  }
}

resolveRemixViteIntegration();
