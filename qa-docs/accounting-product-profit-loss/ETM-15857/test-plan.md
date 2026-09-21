# Test Plan: ETM-15857 — Gross Sales & Qty Sold inline Outbound (Product Profit Loss)

- **Origin Card:** [ETM-15857](https://erpintegration.atlassian.net/browse/ETM-15857) — `[Product Profit Loss] - Gross Sales & Qty Sold inline dengan Outbound (selaras Total COGS)`
- **Tipe card:** Improvement (QA Review · TESTER_GREEN)
- **Menu Target:** Product Profit Loss (`accounting-product-profit-loss` / `/accounting/product-profit-loss`)
- **Staging URL:** `https://staging.olshoperp.com/accounting/product-profit-loss`
- **Related Outbound:** `https://staging.olshoperp.com/supplychain/mutation-outbound`
- **Request ID:** `recvuwsLhHaGar`
- **Owner / Author:** QA - Rachmatulloh Yendy
- **Approval:** Yemima · Ops topic 6059 msg 49101 · IV https://telegra.ph/Test-Plan-09-21
- **Intent:** `extend` — gap G-14 (outbound-inline); reuse TC-PPL-001/002 untuk regresi G-13 (skenario 06)
- **Company default eksekusi TC:** lumicharmsid (`id: 153`) — sama katalog TC-PPL-001..003
- **Metode:** Web UI crawling (+ Export / Refresh / Detail Orders)

---

## Tujuan Pengujian

Memastikan **G-14 / ETM-15857**: Qty Sold, Gross Sales, dan Total COGS di Product Profit Loss **inline Outbound Approved** (ref SOD), bukan pre-recognize dari full SO qty.

---

## Validasi vs Requirement

| Sumber | Status | Relevan | Cukup untuk Expected G-14? |
|---|---|---|---|
| `requirement.md` §5.1 / §5.1.3 · G-14 | **draft** v1.5 | Tanpa outbound → 0; dengan outbound → qty/gross/COGS dari outbound; Gross = Before VAT × qty outbound × exchange | **Ya** — dipakai sebagai SoT |
| `requirement.md` G-13 / §5.1.1–5.1.2 | draft | Gross Before VAT + tooltip | Ya untuk overlap harga (reuse 06) |
| Card ETM-15857 AC | QA Review | Selaras §5.1.3 | Selaras SoT |
| TC-PPL-001/002/003 | approved/passed | G-13 + export/refresh | Reuse / extend — jangan recreate G-13 |

**Kesimpulan:** requirement masih **draft**, tetapi §5.1.3 sudah menulis TO-BE G-14 secara eksplisit. Expected TC mengacu §5.1.3 (bukan `[MENUNGGU REQUIREMENT]`).

---

## Anti-duplikat

- Jira origin: belum ada link QA Test Case sebelum create batch Approval.
- Folder `ETM-15857/` belum ada di main.
- **Reuse:** TC-PPL-001, TC-PPL-002 (Gross Before VAT setelah outbound) → skenario 06.
- **Extend:** TC-PPL-003 pola export/refresh → skenario 07 dengan data TO-BE G-14.

---

## Matriks Skenario (8)

| No | Kode | Type | New/Reuse | Fokus | Expected core (§5.1.3) |
|:---:|:---|:---:|:---|:---|:---|
| 1 | SC-PPL-15857-01 | happy | NEW | SO + Outbound Approved → inline | Gross, Qty Sold, Total COGS terisi bersamaan dari qty outbound; Net/Margin/Avg konsisten |
| 2 | SC-PPL-15857-02 | negative | NEW | SO tanpa Outbound | Qty / Gross / COGS = 0 |
| 3 | SC-PPL-15857-03 | edge | NEW | Partial outbound | Proporsional qty outbound, bukan full SO |
| 4 | SC-PPL-15857-04 | happy | NEW | Basis Gross | Price Before VAT × qty outbound × exchange; bukan including VAT |
| 5 | SC-PPL-15857-05 | negative | NEW | Outbound tanpa ref SOD | Tidak masuk Gross/COGS |
| 6 | SC-PPL-15857-06 | regression | REUSE TC-PPL-001/002 | G-13 under G-14 | Gross Before VAT tetap benar setelah outbound penuh |
| 7 | SC-PPL-15857-07 | regression | NEW (extend 003) | Export + Detail Orders + Refresh | Selaras datalist TO-BE |
| 8 | SC-PPL-15857-08 | edge | NEW | General vs Platform (ASO) | Perilaku sama |

---

## Mapping Skenario → File TC

| Skenario | File | tc_code | test_type |
|---|---|---|---|
| SC-PPL-15857-01 | `test-cases/TC-PPL-DRAFT-20260921093101.md` | PENDING-20260921093101 | happy |
| SC-PPL-15857-02 | `test-cases/TC-PPL-DRAFT-20260921093102.md` | PENDING-20260921093102 | negative |
| SC-PPL-15857-03 | `test-cases/TC-PPL-DRAFT-20260921093103.md` | PENDING-20260921093103 | edge |
| SC-PPL-15857-04 | `test-cases/TC-PPL-DRAFT-20260921093104.md` | PENDING-20260921093104 | happy |
| SC-PPL-15857-05 | `test-cases/TC-PPL-DRAFT-20260921093105.md` | PENDING-20260921093105 | negative |
| SC-PPL-15857-06 | `test-cases/TC-PPL-DRAFT-20260921093106.md` | PENDING-20260921093106 | regression |
| SC-PPL-15857-07 | `test-cases/TC-PPL-DRAFT-20260921093107.md` | PENDING-20260921093107 | regression |
| SC-PPL-15857-08 | `test-cases/TC-PPL-DRAFT-20260921093108.md` | PENDING-20260921093108 | edge |

**Checklist §5C:** 8 skenario → 8 TC. Tidak digabung.

---

## Yang tidak diuji di plan ini

- Perubahan formula COGS di luar aturan outbound × `each_price_before_vat` (sudah ada)
- Sales Return / Failed Ship / Settlement (Next MVP requirement)
- Automate Playwright baru (`automated: false` pada DRAFT)
