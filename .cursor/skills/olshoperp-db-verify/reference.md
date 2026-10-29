# Referensi — olshoperp-db-verify

Dipakai bersama [SKILL.md](SKILL.md). Jangan hardcode API key.

## A. curl (key dari `.env` lokal / mesin agent)

```bash
# Staging
curl -sS -X POST "https://n8n.olshoperp.com/webhook/agent-db-tyas" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $DB_DEBUG_API_KEY" \
  -d '{"db":"staging_olshoperp","query":"SELECT id, sku, name FROM scm_products WHERE owned_by = 153 AND deleted_at IS NULL LIMIT 5"}'

# Tyas
curl -sS -X POST "https://n8n.olshoperp.com/webhook/agent-db-tyas" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $DB_DEBUG_API_KEY" \
  -d '{"db":"tyas_olshoperp","query":"SELECT id, order_no, transaction_status FROM omni_sales_orders WHERE owned_by = 153 AND deleted_at IS NULL LIMIT 5"}'

# Merdian (host n9n)
curl -sS -X POST "https://n9n.olshoperp.com/webhook/agent-db-merdian" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: ${DB_DEBUG_API_KEY_MERDIAN:-$DB_DEBUG_API_KEY}" \
  -d '{"db":"merdian_olshoperp","query":"SELECT id, code, transaction_status FROM scm_purchase_orders WHERE owned_by = 153 AND deleted_at IS NULL LIMIT 5"}'
```

Override URL opsional: `DB_DEBUG_WEBHOOK_URL`, `DB_DEBUG_WEBHOOK_URL_MERDIAN`.

## B. File lokal

| File | Isi |
|------|-----|
| `agent-db/cache.md` | Menu → tabel cepat (S0) |
| `agent-db/schema-catalog.yaml` | Kolom / index |
| `agent-db/README.md` | Write-back cache S6, anti-dump |
| `tests/DATA-VERIFICATION.md` | L1/L2/L3 panjang |
| `.cursor/rules/19-database-data-verification.mdc` | Rule requestable docs |
| `olshoperp/.cursor/rules/19-database-debugger.mdc` | SoT teknis developer |

## C. Company uji sering dipakai

Staging default skill testing: **153** → **112** → **13** (kecuali user sebut lain). Selalu cocokkan `owned_by` dengan company yang diuji.
