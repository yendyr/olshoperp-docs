---
doc_type: technical
menu: generalsetting-country
menu_name: "Master Country"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Master Country — Technical Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Architecture Overview

Master data module GeneralSetting — entity `Country` → table `gs_countries`.

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/master/country/`

| File | Role | Key API |
|------|------|---------|
| `DataLists.vue` | Index | `GET generalsetting/country` |
| `Form.vue` | Create/edit | `POST/PUT generalsetting/country` |

**Router:** `/generalsetting/country` (name: `generalsetting_country_index`)

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/GeneralSetting/Http/Controllers/CountryController.php` | CRUD, select2, audit |
| `Modules/GeneralSetting/Entities/Country.php` | Model |
| `Modules/GeneralSetting/Policies/*` | CountryPolicy |
| `Modules/Gate/Database/Seeders/ModuleMenu/GeneralSettingMenuSeeder.php` | Menu id 6 |

## 4. API Routes

Prefix: `api/generalsetting`

| Method | Path | Action |
|--------|------|--------|
| GET | `/country` | index |
| POST | `/country` | store |
| GET | `/country/{country}` | show |
| PUT | `/country/{country}` | update |
| DELETE | `/country/{country}` | destroy |
| GET | `/country/{country}/audit` | audit |
| GET | `generalsetting/country/select2` | select2 |

## 5. Database Schema

**Table:** `gs_countries` — iso, iso_3, name, nice_name, num_code, phone_code, status, is_all_company, soft deletes, audit columns

## 6. Jobs / Observers / Events

None specific.

## 7. Related db-schema docs

- `gs_countries`
