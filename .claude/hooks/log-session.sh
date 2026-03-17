#!/bin/bash
# Appends a timestamped entry to the session activity log at the end of each response.
# Log lives outside the repo (user-level) to avoid noisy git diffs.

LOG_DIR="$HOME/.claude/sessions/web-waffle"
mkdir -p "$LOG_DIR"
echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) session_end" >> "$LOG_DIR/activity.log"
