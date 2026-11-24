#!/usr/bin/env sh
# agent-kit installer for macOS / Linux.
# One command:    curl -fsSL https://raw.githubusercontent.com/Justsav1e/agent-kit/main/install.sh | sh
# From a copy:    ./install.sh
# Downloads the kit to ~/.agent-kit (running it again updates it) and starts install.mjs,
# which asks what to install. Messages here are ASCII: the shell locale may not be UTF-8.
REPO="https://github.com/Justsav1e/agent-kit.git"
DIR="${AGENT_KIT_DIR:-$HOME/.agent-kit}"

command -v node >/dev/null 2>&1 || { echo "Node.js not found. Install version 22 or newer: https://nodejs.org"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "git not found. Install it: https://git-scm.com"; exit 1; }

HERE=$(cd "$(dirname "$0")" 2>/dev/null && pwd)
if [ -n "$HERE" ] && [ -f "$HERE/install.mjs" ]; then
  KIT="$HERE"
elif [ -d "$DIR/.git" ]; then
  echo "Updating agent-kit in $DIR"
  git -C "$DIR" pull --ff-only -q || echo "Could not update, using the existing copy"
  KIT="$DIR"
else
  echo "Downloading agent-kit to $DIR"
  git clone --depth 1 -q "$REPO" "$DIR" || { echo "Download failed"; exit 1; }
  KIT="$DIR"
fi

# with curl | sh stdin is the script itself: read the answers from the terminal
# a subshell: in sh a failed redirection on a builtin would end the whole script
if [ ! -t 0 ] && (exec </dev/tty) 2>/dev/null; then
  exec node "$KIT/install.mjs" "$@" </dev/tty
fi
exec node "$KIT/install.mjs" "$@"
