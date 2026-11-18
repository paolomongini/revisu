#!/usr/bin/env bash
# Revisu - start the dashboard server and Claude Code (macOS / Linux)
cd "$(dirname "$0")"
PORT=8765
export PATH="$HOME/.local/bin:$PATH"
PY=python3; command -v python3 >/dev/null || PY=python
command -v $PY >/dev/null || { echo "Python not found: run ./setup.sh first."; exit 1; }

set -a; [ -f .env ] && . ./.env; set +a

PORT=${RADAR_PORT:-$PORT}
RADAR_PORT=$PORT $PY scripts/server.py >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1
URL="http://localhost:$PORT/dashboard/"
(command -v open >/dev/null && open "$URL") || (command -v xdg-open >/dev/null && xdg-open "$URL" >/dev/null 2>&1) || true
echo
echo "Revisu dashboard: $URL  (agents can be launched from the page too)"
echo 'In Claude Code try:  /radar nn-sysid  |  /ask chi lavora su MPC in Italia?  |  /status'
echo "Type /exit (or close the window) to stop everything."
echo

if command -v claude >/dev/null; then claude; else echo "Claude Code not found - run ./setup.sh. Ctrl+C to stop."; wait; fi
