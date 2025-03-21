#!/usr/bin/env node

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

function createDetailedLogStream() {
  const logDir = path.join(process.cwd(), 'build-logs');
  fs.mkdirSync(logDir, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const logFile = path.join(logDir, `build-${timestamp}.log`);
  
  return fs.createWriteStream(logFile, { flags: 'a' });
}

function runBuildWithDetailedLogging() {
  const logStream = createDetailedLogStream();
  
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=4096'  // Increase memory allocation
    }
  });

  // Log stdout
  buildProcess.stdout.on('data', (data) => {
    console.log(`[STDOUT] ${data}`);
    logStream.write(`[STDOUT] ${data}`);
  });

  // Log stderr
  buildProcess.stderr.on('data', (data) => {
    console.error(`[STDERR] ${data}`);
    logStream.write(`[STDERR] ${data}`);
  });

  // Handle process exit
  buildProcess.on('close', (code) => {
    logStream.end();
    console.log(`Build process exited with code ${code}`);
    process.exit(code);
  });

  // Handle errors
  buildProcess.on('error', (err) => {
    console.error('Build process error:', err);
    logStream.write(`Build process error: ${err}\n`);
    logStream.end();
    process.exit(1);
  });
}

runBuildWithDetailedLogging();
