#!/bin/bash
# Runs tsc --noEmit after editing any .ts or .tsx file.
# Fast type-check without a full Next.js build (~2-5s vs 30s+).

FILE=$(echo "$CLAUDE_TOOL_INPUT" | python3 -c "
import sys, json, os
try:
    d = json.loads(os.environ.get('CLAUDE_TOOL_INPUT', '{}'))
    print(d.get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null)

if [[ "$FILE" == *.ts ]] || [[ "$FILE" == *.tsx ]]; then
    echo "🔍 Type-checking after editing $(basename "$FILE")..."
    npx tsc --noEmit 2>&1 | tail -25
fi
