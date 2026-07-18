#!/bin/sh
# Grader for chapter P1's harbor-notes tree.
# Usage: sh check.sh [path-to-harbor-notes]   (default: ./harbor-notes)
# POSIX sh on purpose — runs in bare containers and on macOS/Linux/WSL hosts alike.
# (Windows without WSL: run it inside the container, as Lab B shows.)

root="${1:-./harbor-notes}"
pass=0
fail=0

ok()  { pass=$((pass+1)); printf 'PASS  %s\n' "$1"; }
bad() { fail=$((fail+1)); printf 'FAIL  %s\n' "$1"; }

check_dir()  { if [ -d "$1" ]; then ok "$2"; else bad "$2"; fi; }
check_file() { if [ -f "$1" ]; then ok "$2"; else bad "$2"; fi; }
check_gone() { if [ ! -e "$1" ]; then ok "$2"; else bad "$2"; fi; }

check_dir  "$root"                  "harbor-notes/ exists"
check_dir  "$root/docs"             "docs/ exists"
check_dir  "$root/drafts"           "drafts/ exists"
check_file "$root/docs/setup.md"    "docs/setup.md exists"
check_file "$root/docs/commands.md" "docs/commands.md exists"
check_file "$root/docs/idea.md"     "docs/idea.md exists (moved from drafts/ and renamed)"
check_gone "$root/drafts/idea.txt"  "drafts/idea.txt is gone (it moved)"
check_gone "$root/docs-backup"      "docs-backup/ is gone (rm -r cleaned it up)"

printf -- '----\n%d passed, %d failed\n' "$pass" "$fail"
if [ "$fail" -eq 0 ]; then
    echo 'All good — tree matches the lab. ✔'
    exit 0
else
    echo 'Re-check the FAIL lines above, then run me again.'
    exit 1
fi
