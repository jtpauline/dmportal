// Development Preflight Checks
import fs from 'fs';
import path from 'path';

async function preflightChecks() {
  console.log('🚀 Running Preflight Checks');
  
  // Check critical dependencies
  const criticalDeps = [
    '@remix-run/dev',
    '@remix-run/react',
    'react',
    'vite',
    'typescript'
  ];

  criticalDeps.forEach(dep => {
    try {
      require.resolve(dep);
      console.log(`✅ ${dep} is installed`);
    } catch (error) {
      console.error(`❌ Critical dependency missing: ${dep}`);
      process.exit(1);
    }
  });

  // Check configuration files
  const configFiles = [
    'remix.config.js',
    'vite.config.ts',
    'tsconfig.json',
    'package.json'
  ];

  configFiles.forEach(file => {
    const filePath = path.resolve(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Missing configuration file: ${file}`);
      process.exit(1);
    }
  });

  console.log('🎉 All preflight checks passed successfully!');
}

preflightChecks().catch(error => {
  console.error('Preflight check failed:', error);
  process.exit(1);
});
