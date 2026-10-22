#!/bin/zsh
# usage: jira.sh GET|POST|PUT <path> [json-body-file]   (JV=2 to use REST v2)
ENVF=${OLSHOP_ENV_FILE:-$HOME/Documents/GitHub/olshoperp/.env}
JE=$(grep '^JIRA_EMAIL=' $ENVF | cut -d= -f2- | tr -d '"'"'")
JT=$(grep '^JIRA_API_TOKEN=' $ENVF | cut -d= -f2- | tr -d '"'"'")
V=${JV:-3}
M=$1; P=$2; B=$3
if [ -n "$B" ]; then
  printf 'user = "%s:%s"\n' "$JE" "$JT" | curl -sS -K - -X $M -H 'Content-Type: application/json' --data @"$B" "https://erpintegration.atlassian.net/rest/api/$V/$P"
else
  printf 'user = "%s:%s"\n' "$JE" "$JT" | curl -sS -K - -X $M "https://erpintegration.atlassian.net/rest/api/$V/$P"
fi
