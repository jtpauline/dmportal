#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

function createDetailedLogStream() {
  const logDir = path.join(process.cwd(), 'build-logs');
  fs.mkdirSync(logDir, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const logFile = path.join(logDir, `build-troubleshoot-${timestamp}.log`);
  
  return fs.createWriteStream(logFile, { flags: 'a' });
}

function runBuildWithExtendedDiagnostics() {
  const logStream = createDetailedLogStream();
  
  console.log('🚀 Starting Extended Build Diagnostics');
  
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=8192',  // Increase memory allocation to 8GB
      NODE_ENV: 'production'
    }
  });

  // Timestamp helper
  const getTimestamp = () => new Date().toISOString();

  // Log stdout with timestamps
  buildProcess.stdout.on('data', (data) => {
    const message = `[${getTimestamp()}] [STDOUT] ${data}`;
    console.log(message);
    logStream.write(message + '\n');
  });

  // Log stderr with timestamps and additional context
  buildProcess.stderr.on('data', (data) => {
    const message = `[${getTimestamp()}] [STDERR] ${data}`;
    console.error(message);
    logStream.write(message + '\n');
  });

  // Detailed process exit handling
  buildProcess.on('close', (code) => {
    const message = `Build process exited with code ${code}`;
    console.log(message);
    logStream.write(`[${getTimestamp()}] ${message}\n`);
    logStream.end();

    if (code !== 0) {
      console.error('❌ Build failed. Check build-logs for detailed information.');
      process.exit(1);
    } else {
      console.log('✅ Build completed successfully');
    }
  });

  // Comprehensive error handling
  buildProcess.on('error', (err) => {
    const message = `Build process error: ${err}`;
    console.error(message);
    logStream.write(`[${getTimestamp()}] ${message}\n`);
    logStream.end();
    process.exit(1);
  });
}

// Run the troubleshooter
runBuildWithExtendedDiagnostics();
