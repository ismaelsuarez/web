#!/usr/bin/env bash
set -euo pipefail

URL="${1:-}"
if [[ -z "$URL" ]]; then
  echo "Usage: $0 https://staging.example.com" >&2
  exit 1
fi

echo "Validating security headers at: $URL"
headers=$(curl -sSI "$URL" || true)

echo "$headers" | grep -iq "^strict-transport-security:" || { echo "Missing Strict-Transport-Security"; exit 2; }
echo "$headers" | grep -iq "^content-security-policy:" || { echo "Missing Content-Security-Policy"; exit 3; }
echo "$headers" | grep -iq "^x-frame-options:" || { echo "Missing X-Frame-Options"; exit 4; }

echo "All required headers present."

