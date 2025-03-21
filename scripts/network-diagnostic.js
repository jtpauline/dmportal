#!/usr/bin/env node

import https from 'https';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function safeExec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error(error.message);
    return null;
  }
}

function checkNpmRegistry() {
  console.log('🔍 NPM Registry Diagnostic');

  // Check current registry
  const registry = safeExec('npm config get registry');
  console.log(`📡 Current Registry: ${registry || 'Unknown'}`);

  // Verify package.json
  const packagePath = path.join(process.cwd(), 'package.json');
  try {
    const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log('📦 Package Dependencies:');
    console.log('   Dependencies:', Object.keys(packageContent.dependencies || {}).length);
    console.log('   DevDependencies:', Object.keys(packageContent.devDependencies || {}).length);
  } catch (error) {
    console.error('❌ Unable to read package.json:', error.message);
  }

  // Network connectivity test
  function testHttpsConnection(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            status: res.statusCode,
            headers: res.headers
          });
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  // Specific package check
  async function checkRemixPackage() {
    const packageUrl = 'https://registry.npmjs.org/@remix-run/vite';
    try {
      const result = await testHttpsConnection(packageUrl);
      console.log('📦 Remix Vite Package Check:');
      console.log(`   Status: ${result.status}`);
      console.log(`   Headers: ${JSON.stringify(result.headers, null, 2)}`);
    } catch (error) {
      console.error('❌ Package Lookup Failed:', error.message);
    }
  }

  checkRemixPackage();
}

// Recovery actions
function recoverNpmConfig() {
  console.log('\n🔧 NPM Configuration Recovery');
  
  // Reset registry
  safeExec('npm config set registry https://registry.npmjs.org/');
  
  // Clear cache
  safeExec('npm cache clean --force');
  
  // Update .npmrc
  const npmrcContent = `
registry=https://registry.npmjs.org/
strict-ssl=false
timeout=600000
fetch-retries=3
`;
  
  fs.writeFileSync(path.join(process.cwd(), '.npmrc'), npmrcContent);
  console.log('✅ NPM Configuration Reset');
}

function main() {
  checkNpmRegistry();
  recoverNpmConfig();
}

main();
