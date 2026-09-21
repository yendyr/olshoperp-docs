# Test Cases — Product Profit Loss (ETM-15857)

Card origin: [ETM-15857](https://erpintegration.atlassian.net/browse/ETM-15857) — Gross Sales & Qty Sold inline Outbound (G-14).

Test plan: [../test-plan.md](../test-plan.md) · Request ID: `recvuwsLhHaGar` · Owner: QA - Rachmatulloh Yendy · Intent: **extend** (reuse TC-PPL-001/002 pada SC-06)

| TC Code | Title | Status | Automated | Last Updated |
|---|---|---|---|---|
| PENDING-20260921093101 | SO + Outbound Approved → Gross/Qty/COGS inline | draft | ❌ | 2026-09-21 |
| PENDING-20260921093102 | SO Approved tanpa Outbound → Gross/Qty/COGS = 0 | draft | ❌ | 2026-09-21 |
| PENDING-20260921093103 | Partial outbound proporsional | draft | ❌ | 2026-09-21 |
| PENDING-20260921093104 | Gross = Price Before VAT × outbound qty × exchange | draft | ❌ | 2026-09-21 |
| PENDING-20260921093105 | Outbound tanpa ref SOD exclude dari Gross/COGS | draft | ❌ | 2026-09-21 |
| PENDING-20260921093106 | Retest Gross Before VAT (reuse TC-PPL-001/002) under G-14 | draft | ❌ | 2026-09-21 |
| PENDING-20260921093107 | Export + Detail Orders + Refresh selaras TO-BE | draft | ❌ | 2026-09-21 |
| PENDING-20260921093108 | Order General dan Platform (ASO) perilaku sama | draft | ❌ | 2026-09-21 |

| Skenario | File | tc_code | test_type |
|---|---|---|---|
| SC-PPL-15857-01 | [TC-PPL-DRAFT-20260921093101.md](./TC-PPL-DRAFT-20260921093101.md) | PENDING-20260921093101 | happy |
| SC-PPL-15857-02 | [TC-PPL-DRAFT-20260921093102.md](./TC-PPL-DRAFT-20260921093102.md) | PENDING-20260921093102 | negative |
| SC-PPL-15857-03 | [TC-PPL-DRAFT-20260921093103.md](./TC-PPL-DRAFT-20260921093103.md) | PENDING-20260921093103 | edge |
| SC-PPL-15857-04 | [TC-PPL-DRAFT-20260921093104.md](./TC-PPL-DRAFT-20260921093104.md) | PENDING-20260921093104 | happy |
| SC-PPL-15857-05 | [TC-PPL-DRAFT-20260921093105.md](./TC-PPL-DRAFT-20260921093105.md) | PENDING-20260921093105 | negative |
| SC-PPL-15857-06 | [TC-PPL-DRAFT-20260921093106.md](./TC-PPL-DRAFT-20260921093106.md) | PENDING-20260921093106 | regression |
| SC-PPL-15857-07 | [TC-PPL-DRAFT-20260921093107.md](./TC-PPL-DRAFT-20260921093107.md) | PENDING-20260921093107 | regression |
| SC-PPL-15857-08 | [TC-PPL-DRAFT-20260921093108.md](./TC-PPL-DRAFT-20260921093108.md) | PENDING-20260921093108 | edge |

Expected mengacu `requirement.md` §5.1.3 (draft v1.5). Company default: lumicharmsid (153).
