#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function dependencyAudit() {
  console.log('🔍 Dependency Audit and Cleanup');
  
  // Check package.json
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log('\n📦 Dependency Analysis:');
  
  // Count dependencies
  const dependencies = packageContent.dependencies || {};
  const devDependencies = packageContent.devDependencies || {};
  
  console.log(`Total Dependencies: ${Object.keys(dependencies).length}`);
  console.log(`Total Dev Dependencies: ${Object.keys(devDependencies).length}`);
  
  // Identify potential issues
  const outdatedDeps = [];
  const potentialConflicts = [];
  
  try {
    // Check for outdated dependencies
    const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8' });
    const outdatedDependencies = JSON.parse(outdatedOutput);
    
    Object.keys(outdatedDependencies).forEach(dep => {
      outdatedDeps.push({
        name: dep,
        current: outdatedDependencies[dep].current,
        wanted: outdatedDependencies[dep].wanted,
        latest: outdatedDependencies[dep].latest
      });
    });
  } catch (error) {
    console.warn('⚠️ Unable to check for outdated dependencies');
  }
  
  console.log('\n🚨 Potential Issues:');
  if (outdatedDeps.length > 0) {
    console.log('Outdated Dependencies:');
    outdatedDeps.forEach(dep => {
      console.log(`  - ${dep.name}: 
        Current: ${dep.current} 
        Wanted: ${dep.wanted} 
        Latest: ${dep.latest}`);
    });
  }
  
  // Recommend cleanup actions
  console.log('\n🧹 Recommended Actions:');
  console.log('1. Remove unused dependencies');
  console.log('2. Update outdated packages');
  console.log('3. Verify peer dependencies');
  
  return {
    outdatedDeps,
    potentialConflicts
  };
}

// Run the audit
dependencyAudit();
