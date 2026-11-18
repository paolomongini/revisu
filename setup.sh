#!/usr/bin/env bash
# Revisu - one-time setup for macOS and Linux. Safe to run again (e.g. to change keys).
# Installs what is missing (Python 3, Claude Code), asks for the optional keys, tests the data layer.
set -e
cd "$(dirname "$0")"
ok()   { printf '  \033[32m[OK]\033[0m %s\n' "$1"; }
warn() { printf '  \033[33m[!]\033[0m  %s\n' "$1"; }
step() { printf '\n\033[36m== %s\033[0m\n' "$1"; }
export PATH="$HOME/.local/bin:$PATH"

find_python() {
  for c in python3 python; do
    if command -v "$c" >/dev/null 2>&1 && "$c" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)' 2>/dev/null; then
      echo "$c"; return 0
    fi
  done
  return 1
}

printf '\n\033[36m=== Revisu - Research Visualisation Support - setup ===\033[0m\n'

step "1/4 Python"
if ! PY=$(find_python); then
  warn "Python 3.9+ not found, installing it..."
  case "$(uname -s)" in
    Darwin)
      if command -v brew >/dev/null; then brew install python
      else
        warn "Opening Apple's installer for the Command Line Tools (they include Python 3)."
        xcode-select --install || true
        warn "When that installation finishes, run this setup again."; exit 1
      fi ;;
    Linux)
      if   command -v apt-get >/dev/null; then sudo apt-get update && sudo apt-get install -y python3
      elif command -v dnf     >/dev/null; then sudo dnf install -y python3
      elif command -v pacman  >/dev/null; then sudo pacman -S --noconfirm python
      elif command -v zypper  >/dev/null; then sudo zypper install -y python3
      else warn "Install Python 3 with your package manager, then run this setup again."; exit 1; fi ;;
  esac
  PY=$(find_python) || { warn "Python still not found. Install it from https://www.python.org/downloads/"; exit 1; }
fi
ok "$($PY --version)"

step "2/4 Claude Code"
if command -v claude >/dev/null; then
  ok "Claude Code $(claude --version)"
else
  echo "  Installing Claude Code with the official installer (https://claude.ai/install.sh)..."
  curl -fsSL https://claude.ai/install.sh | bash
  export PATH="$HOME/.local/bin:$PATH"
  command -v claude >/dev/null && ok "Claude Code installed" || { warn "Install Claude Code from https://claude.com/claude-code, then rerun."; exit 1; }
fi

step "3/4 Keys (saved only in the local .env file, never shared)"
touch .env; chmod 600 .env
get() { grep -E "^$1=" .env | head -1 | cut -d= -f2- || true; }
ANT=$(get ANTHROPIC_API_KEY); OAX=$(get OPENALEX_API_KEY)
read -r -p "  Do you use Claude with a Pro/Max subscription? [Y/n] " sub
if [[ "$sub" =~ ^[nN] ]]; then
  read -r -s -p "  ANTHROPIC_API_KEY (from console.anthropic.com, Enter keeps the saved one): " k; echo
  [ -n "$k" ] && ANT="$k"
else
  ok "subscription: you will log in inside Claude Code on first start (no key needed)"
fi
echo
echo "  OpenAlex key: FREE and optional, but without it you can download only ~5 topics per day."
read -r -s -p "  OPENALEX_API_KEY from https://openalex.org/settings/api (Enter = skip/keep): " o; echo
[ -n "$o" ] && OAX="$o"
{
  echo "# Revisu secrets - never commit or share this file"
  [ -n "$ANT" ] && echo "ANTHROPIC_API_KEY=$ANT"
  [ -n "$OAX" ] && echo "OPENALEX_API_KEY=$OAX"
} > .env
ok ".env saved"

step "4/4 Test"
$PY scripts/radar.py index >/dev/null && ok "data layer works (no extra libraries needed)"
chmod +x start.sh setup.sh start.command setup.command 2>/dev/null || true
printf '\n\033[32mSetup complete. Now run:  ./start.sh   (on a Mac you can also double-click start.command)\033[0m\n'
printf '\033[32mThe first time, Claude Code asks you to log in and whether you trust this folder: answer Yes.\033[0m\n'
