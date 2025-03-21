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

function updatePackageJson() {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Remove @remix-run/vite if it exists
  if (packageJson.devDependencies) {
    delete packageJson.devDependencies['@remix-run/vite'];
  }

  // Add GitHub repository installation
  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies['@remix-run/vite'] = 'github:remix-run/remix#main';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json updated with GitHub repository source');
}

function resolveRemixVite() {
  console.log('🔍 Remix Vite Package Resolution');

  // Clear npm cache
  console.log('🧹 Clearing NPM Cache');
  safeExec('npm cache clean --force');

  // Update package.json to use GitHub source
  updatePackageJson();

  // Install dependencies
  console.log('📦 Installing Dependencies');
  try {
    safeExec('npm install');
    console.log('✅ Dependencies Installed Successfully');
  } catch (error) {
    console.error('❌ Dependency Installation Failed');
    console.error(error.message);
  }

  // Verify installation
  try {
    const installedVersion = safeExec('npm list @remix-run/vite');
    console.log('🔍 Installed Version:', installedVersion || 'Not Found');
  } catch (error) {
    console.error('❌ Version Verification Failed');
  }
}

resolveRemixVite();
