#!/usr/bin/env bash
# Inject docs-screening routine context on Cursor session start.
set -euo pipefail
cat >/dev/null
cat <<'JSON'
{"additional_context":"ROUTINE Docs Screening aktif. Saat session start / tiap jam: screen Jira ETM non–Test Case status To Do+Done (updated sejak last putaran), update SoT docs bila perlu (To Do→TO-BE, Done→AS-IS), mirror olshoperp→olshoperp-docs, commit+push, kirim Telegram topic 30246 format di hazel/docs-screening-routine.md. Reminder menu+lingo (maks 10) hanya jam 08:00 WIB. Baca state di agent store docs-screening/state.json."}
JSON
