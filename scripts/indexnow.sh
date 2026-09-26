#!/usr/bin/env bash
# Avisa a Bing (y otros buscadores compatibles con IndexNow) de las URLs del sitemap.
# Uso: scripts/indexnow.sh            (envía todas las URLs de sitemap.xml)
#      scripts/indexnow.sh URL [URL…] (envía solo esas URLs)
set -euo pipefail

HOST="davidotero.es"
KEY="b13cb382fcfd431f54f9cac6fe436f8a"
cd "$(dirname "$0")/.."

if [ "$#" -gt 0 ]; then
  URLS=("$@")
else
  mapfile -t URLS < <(grep -oP '(?<=<loc>)[^<]+' sitemap.xml)
fi

LIST=$(printf '"%s",' "${URLS[@]}")
BODY="{\"host\":\"$HOST\",\"key\":\"$KEY\",\"keyLocation\":\"https://$HOST/$KEY.txt\",\"urlList\":[${LIST%,}]}"

curl -sS -o /dev/null -w "IndexNow: HTTP %{http_code} (${#URLS[@]} URLs)\n" \
  -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$BODY"
