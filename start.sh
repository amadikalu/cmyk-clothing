#!/usr/bin/env bash

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR" || exit 1

echo "--> Checking workspace environment..."
# DEEP CHECK: Verify the specific binary exists and is executable
if [ ! -x "./node_modules/.bin/concurrently" ]; then
  echo "--> Missing 'concurrently' binary. Installing dependencies..."
  npm install --silent
fi

echo "--> Cleaning target ports (3000, 5173)..."
node -e "
const { execSync } = require('child_process');
[3000, 5173].forEach(port => {
  try {
    const pid = execSync(\`lsof -t -i:\${port}\`).toString().trim();
    if (pid) process.kill(Number(pid), 'SIGTERM');
  } catch (e) {}
});
" 2>/dev/null || killall node 2>/dev/null || true

echo "--> Verifying code health across workspace..."
npm run format --yes 2>/dev/null || npm run lint --yes 2>/dev/null || true

echo "--> Launching CMYK Full-Stack Environment..."
npm run dev
