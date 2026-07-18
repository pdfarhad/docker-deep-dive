#!/usr/bin/env bash
# Self-grader for chapter P2 — run INSIDE the permbox container:  bash /labs/check.sh
# Checks the /lab tree built in Lab C. PASS/FAIL per item; exits non-zero on any FAIL.

pass=0; fail=0
ok()  { echo "PASS  $1"; pass=$((pass+1)); }
bad() { echo "FAIL  $1 — $2"; fail=$((fail+1)); }

mode()  { stat -c '%a' "$1" 2>/dev/null; }
owner() { stat -c '%U:%G' "$1" 2>/dev/null; }

id -u dev >/dev/null 2>&1 \
  && ok "user dev exists" \
  || bad "user dev exists" "create it: useradd -m -s /bin/bash dev"

[ -x /lab/hello.sh ] \
  && ok "hello.sh is executable" \
  || bad "hello.sh is executable" "chmod u+x /lab/hello.sh"

/lab/hello.sh 2>/dev/null | grep -q "hello from" \
  && ok "hello.sh runs and greets" \
  || bad "hello.sh runs and greets" "it should echo: hello from \$(whoami)"

[ "$(mode /lab/app.conf)" = "644" ] \
  && ok "app.conf is 644 (rw-r--r--)" \
  || bad "app.conf is 644" "chmod 644 /lab/app.conf (found: $(mode /lab/app.conf))"

[ "$(mode /lab/secret.env)" = "600" ] \
  && ok "secret.env is 600 (rw-------)" \
  || bad "secret.env is 600" "chmod 600 /lab/secret.env (found: $(mode /lab/secret.env))"

[ -d /lab/public ] && [ "$(mode /lab/public)" = "755" ] \
  && ok "public/ is a 755 directory" \
  || bad "public/ is a 755 directory" "mkdir /lab/public && chmod 755 /lab/public"

[ -d /lab/vault ] && [ "$(mode /lab/vault)" = "600" ] \
  && ok "vault/ is a 600 directory (unenterable)" \
  || bad "vault/ is a 600 directory" "mkdir /lab/vault && chmod 600 /lab/vault"

[ "$(owner /lab/handoff.txt)" = "dev:dev" ] \
  && ok "handoff.txt owned by dev:dev" \
  || bad "handoff.txt owned by dev:dev" "chown dev:dev /lab/handoff.txt (found: $(owner /lab/handoff.txt))"

echo
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
