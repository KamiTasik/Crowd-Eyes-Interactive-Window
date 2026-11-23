#!/bin/bash
# Crowd Eyes — documentation auto-blink launcher for Mac Mini
# Double-click this file (or run it in Terminal) to open the live page
# with sporadic random blinking. No webcam required.
#
# First time only: right-click → Open (macOS may block unsigned .command files).
# Or in Terminal:  chmod +x macmini-auto-blink.command

URL="https://kamitasik.github.io/Crowd-Eyes-Interactive-Window/?auto=1"

echo "Opening Crowd Eyes auto-blink:"
echo "  $URL"
echo ""
echo "Eyes blink on their own every couple of seconds."
echo "Space / touch still work if you need a long hold."
echo "Close the browser tab when you are done filming."
echo ""

# Prefer Chrome if installed, then Safari, then default handler
if [ -d "/Applications/Google Chrome.app" ]; then
  open -a "Google Chrome" "$URL"
elif [ -d "/Applications/Chromium.app" ]; then
  open -a "Chromium" "$URL"
else
  open "$URL"
fi
