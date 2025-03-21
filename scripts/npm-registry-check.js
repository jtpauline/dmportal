#!/usr/bin/env node

import https from 'https';
import { execSync } from 'child_process';

function checkNpmRegistry() {
  console.log('🔍 NPM Registry Diagnostic');

  // Check current registry
  try {
    const registry = execSync('npm config get registry', { encoding: 'utf8' }).trim();
    console.log(`📡 Current Registry: ${registry}`);
  } catch (error) {
    console.error('❌ Unable to retrieve current registry');
  }

  // Test registry connectivity
  function testRegistryConnection(url) {
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
      const result = await testRegistryConnection(packageUrl);
      console.log('📦 Remix Vite Package Check:');
      console.log(`   Status: ${result.status}`);
      console.log(`   Headers: ${JSON.stringify(result.headers, null, 2)}`);
    } catch (error) {
      console.error('❌ Package Lookup Failed:', error.message);
    }
  }

  // Network diagnostics
  function networkDiagnostics() {
    try {
      console.log('\n🌐 Network Diagnostics:');
      const dnsCheck = execSync('dig +short npmjs.org', { encoding: 'utf8' });
      console.log('DNS Resolution: Successful');
      console.log('Resolved IP:', dnsCheck.trim());
    } catch {
      console.warn('⚠️ DNS Resolution Failed');
    }

    try {
      const pingResult = execSync('ping -c 4 registry.npmjs.org', { encoding: 'utf8' });
      console.log('Ping Results:\n', pingResult);
    } catch (error) {
      console.error('❌ Ping Failed:', error.message);
    }
  }

  checkRemixPackage();
  networkDiagnostics();
}

checkNpmRegistry();
