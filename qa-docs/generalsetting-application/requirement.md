---
doc_type: requirement
menu: generalsetting-application
menu_name: "Application"
version: 1.0
last_updated: 2026-06-19
owner: QA - Yemima
status: draft
---

# Application (General Settings) — Requirement Documentation

> **Draft — 2026-06-19** — Dokumentasi AS-IS dari kode production. Belum review QA/PM; jangan jadikan referensi final.

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-06-19 | QA - Yemima | Initial draft (AS-IS) |

## 1. Ringkasan Eksekutif

Per-company application toggles via three controllers; primary entity for menu class is `RenderTransactionLimit`.

## 2. Acceptance Criteria (AS-IS)

| ID | Kriteria | Validasi | Fitur |
|----|----------|----------|-------|
| A-01 | Load render limit by company | index owned_by | Transaction window |
| A-02 | Upsert render limit on POST | store create or update | Save days |
| A-03 | in_days required numeric | store validation | Form |
| A-04 | include_virtual_wh_void optional | store | Toggle |
| A-05 | Cache clear menu + render limit | Cache::forget on store | Side effect |
| A-06 | Order process toggles | OrderProcessSettingController | SO automation |
| A-07 | process_to_wave change triggers SO random job | generateDetailSORandom | Backend |
| A-08 | getTransactionTimeLimit public API | GET endpoint | Other modules |

## 3. Validasi & Rules

### RenderTransactionLimit store

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-01 | in_days required numeric | Save transaction window | Laravel validation |
| V-02 | include_virtual_wh_void nullable | Toggle | Mass assign |

### OrderProcessSetting store

| ID | Rule | Trigger | Pesan error |
|----|------|---------|-------------|
| V-10 | auto_approve required | POST | Laravel validation |
| V-11 | process_to_wave required | POST | Laravel validation |
| V-12 | instant_processing required | POST | Laravel validation |
| V-13 | Boolean string 'true' cast | each field | 0/1 in DB |

## 4. Fitur & Behavior

| ID | Fitur | Trigger | Expected result |
|----|-------|---------|-----------------|
| F-01 | Empty in_days | getTransactionTimeLimit | subYear date |
| F-02 | With in_days | getTransactionTimeLimit | now - in_days |
| F-03 | FE watch auto_approve | toggle | Auto POST order-process-setting |
| F-04 | Generate SO section | separate API | generate-so-setting resource |
| F-05 | Global broadcast | POST global-broadcast | NotificationController |

## 5. Permission & Dependencies

- Policy: `RenderTransactionLimitPolicy`
- Depends: Omni global settings (auto approve duration), Supply Chain waves
- Menu id 244 — delete disabled in seeder

## 6. QA Test Notes

- [ ] Set in_days 30 → verify SO list cutoff
- [ ] Toggle include_virtual_wh_void → stock calculation changes
- [ ] Instant processing ON → approved SO skips fulfillment steps
- [ ] Audit log opens for render-transaction-limit

## 7. Known Gaps / Open Questions

- Process to Wave UI commented — is feature still active via API only?
- Generate SO + Reverb sections need separate doc slice or stay in Application technical.

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Omni global settings | omni-global-settings (pending manifest) |
