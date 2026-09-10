import { spawn } from 'node:child_process';

const packageManager = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const processes = [
  ['host', ['--filter', 'host', 'dev']],
  ['detail', ['--filter', 'mfe-detail', 'preview']],
  ['history', ['--filter', 'mfe-history', 'preview']],
];
const children = [];
let shuttingDown = false;

for (const [name, args] of processes) {
  const child = spawn(packageManager, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, FORCE_COLOR: '1' },
  });

  child.on('error', (error) => {
    console.error(`[${name}] ${error.message}`);
    shutdown(1);
  });

  child.on('exit', (code, signal) => {
    if (!shuttingDown && (code ?? 0) !== 0) {
      console.error(`[${name}] stopped with ${signal ?? `exit code ${code}`}`);
      shutdown(code ?? 1);
    }
  });

  children.push(child);
}

function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }

  setTimeout(() => process.exit(exitCode), 100);
}

process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());