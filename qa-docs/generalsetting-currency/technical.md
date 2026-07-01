---
doc_type: technical
menu: generalsetting-currency
menu_name: "Master Currency"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Master Currency — Technical Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Architecture Overview

Currency ↔ countries many-to-many via pivot model on `Currency` relationship `countries()`.

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/master/currency/`

| File | Role | Key API |
|------|------|---------|
| `DataLists.vue` | Index | `GET generalsetting/currency` |
| `Form.vue` | Create/edit | `POST/PUT generalsetting/currency`, country select2 |

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/GeneralSetting/Http/Controllers/CurrencyController.php` | CRUD, cek_relasi |
| `Modules/GeneralSetting/Entities/Currency.php` | Model |
| `config/currency.php` | primary.id |

## 4. API Routes

| Method | Path | Action |
|--------|------|--------|
| GET | `/currency` | index |
| POST | `/currency` | store |
| GET | `/currency/{currency}` | show |
| PUT | `/currency/{currency}` | update |
| DELETE | `/currency/{currency}` | destroy |
| GET | `/currency/{currency}/audit` | audit |
| GET | `currency/select2/country` | select2country |

## 5. Database Schema

| Table | Notes |
|-------|-------|
| `gs_currencies` | code, name, symbol, status, is_primary |
| currency-country pivot | country_id (via Entity relation) |

## 6. Jobs / Observers / Events

None.

## 7. Related db-schema docs

- `gs_currencies`, pivot tables
