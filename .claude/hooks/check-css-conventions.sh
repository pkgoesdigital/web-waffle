#!/bin/bash
# Warns when CSS Modules files introduce convention violations:
#   - Hardcoded colors instead of CSS custom properties from globals.css
#   - !important (use specificity or global utility classes instead)

FILE=$(python3 -c "
import sys, json, os
try:
    d = json.loads(os.environ.get('CLAUDE_TOOL_INPUT', '{}'))
    print(d.get('file_path', ''))
except Exception:
    print('')
" 2>/dev/null)

if [[ "$FILE" != *.module.css ]]; then
    exit 0
fi

CONTENT=$(python3 -c "
import sys, json, os
try:
    d = json.loads(os.environ.get('CLAUDE_TOOL_INPUT', '{}'))
    print(d.get('content', d.get('new_string', '')))
except Exception:
    print('')
" 2>/dev/null)

WARNINGS=0

if echo "$CONTENT" | grep -qE '!important'; then
    echo "⚠️  CSS convention: !important found in $(basename "$FILE"). Use CSS specificity or a global utility class instead."
    WARNINGS=$((WARNINGS + 1))
fi

if echo "$CONTENT" | grep -qE ':\s*(#[0-9a-fA-F]{3,8}|rgb\(|rgba\(|hsl\()'; then
    echo "⚠️  CSS convention: hardcoded color value in $(basename "$FILE"). Use CSS custom properties from globals.css (e.g., var(--color-text), var(--color-accent))."
    WARNINGS=$((WARNINGS + 1))
fi

if [ "$WARNINGS" -gt 0 ]; then
    echo "   See src/app/globals.css for available custom properties."
fi
