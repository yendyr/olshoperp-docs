---
doc_type: technical
menu: generalsetting-region
menu_name: "Master Region"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Master Region — Technical Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 1. Architecture Overview

Region codes encode hierarchy; Country.phone_code anchors province level.

## 2. Frontend File Map

**Root:** `olshoperp-frontend/src/pages/master/region/`

| File | Role | Key API |
|------|------|---------|
| `DataLists.vue` | Index | `GET generalsetting/region` |
| `Form.vue` | Create/edit | `POST/PUT generalsetting/region` |

Company address forms (internal/general) consume select2 endpoints.

## 3. Backend File Map

| File | Role |
|------|------|
| `Modules/GeneralSetting/Http/Controllers/RegionController.php` | CRUD + select2 cascade |
| `Modules/GeneralSetting/Entities/Region.php` | Model `gs_regions` |

## 4. API Routes

| Method | Path | Action |
|--------|------|--------|
| GET | `/region` | index |
| POST | `/region` | store |
| GET | `/region/{region}` | show |
| PUT | `/region/{region}` | update |
| DELETE | `/region/{region}` | destroy |
| GET | `/region/{region}/audit` | audit |
| GET | `/country/{country}/region/select2/province` | select2Province |
| GET | `/region/{region}/select2/{type}` | select2Region (city/district/village) |
| GET | `/region/show/{region}` | showRegion |

## 5. Database Schema

**Table:** `gs_regions` — code (unique), name, status, is_all_company, soft deletes

## 6. Jobs / Observers / Events

None.

## 7. Related db-schema docs

- `gs_regions`
