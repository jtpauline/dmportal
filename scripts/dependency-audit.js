#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function dependencyAudit() {
  console.log('🔍 Comprehensive Dependency Audit');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const requiredDependencies = [
    '@remix-run/dev',
    '@remix-run/node', 
    '@remix-run/react', 
    '@remix-run/serve',
    'remix',
    'react', 
    'react-dom',
    '@vitejs/plugin-react',
    'vite',
    'typescript',
    'vite-tsconfig-paths'
  ];

  console.log('\n📦 Dependency Verification:');
  
  const missingDependencies = requiredDependencies.filter(dep => 
    !packageContent.dependencies[dep] && !packageContent.devDependencies[dep]
  );

  if (missingDependencies.length > 0) {
    console.log('🚨 Missing Dependencies:');
    missingDependencies.forEach(dep => console.log(`  - ${dep}`));
    
    console.log('\n🔧 Recommended Installation:');
    console.log('Run: npm install ' + missingDependencies.join(' '));
    
    return {
      status: 'INCOMPLETE',
      missingDependencies
    };
  }

  console.log('✅ All core dependencies are present');
  return {
    status: 'COMPLETE'
  };
}

const auditResult = dependencyAudit();
process.exit(auditResult.status === 'INCOMPLETE' ? 1 : 0);
