---
doc_type: requirement
menu: random-sku
menu_name: "Random SKU"
version: 1.1
last_updated: 2026-10-02
owner: QA - Yemima
status: review
cross_menu: true
---

# Random SKU — Requirement Documentation

## 0. Metadata

**Tipe:** Cross-menu concept (bukan satu halaman UI)  
**Aliases:** Random SKU, Barang Random, Variant Random, Order Random

> **Changelog 1.1 (2026-10-02):** A-14/A-15 — Retail Price untuk breakdown bundle (bukan Benchmark); sebelum vs sesudah processing. [ETM-16216](https://erpintegration.atlassian.net/browse/ETM-16216) · [System Product §11.6](../system-product/requirement.md#116-random-sku-di-breakdown-bundle--retail-price-to-be--etm-16216).

---

## 1. Ringkasan

Virtual SKU (non-stockable) auto-generated saat opsi `random` dipilih di variant type System Product. Berfungsi sebagai **trigger logic** untuk auto-pick sibling variant dengan stock tertinggi saat fulfillment — bukan barang fisik.

Di System Product, variant random **punya input Retail Price** (seperti variant lain). Order internal: add single random → default Price = retail itu. Order platform single: harga baris tetap **dari platform**.

---

## 2. Acceptance Criteria

| ID | Kriteria |
|----|----------|
| A-01 | Opsi `random` tersedia per variant type (Master Variant) |
| A-02 | SKU `-random` auto-generated saat variant product dibuat dengan opsi random |
| A-03 | Max 3 variant type per product |
| A-04 | User tidak bisa buat SKU manual mengandung kata `random` |
| A-05 | Saat order/wave dengan SKU random → system pick sibling stock tertinggi (warehouse parent hierarchy) |
| A-06 | Bundle dengan random di detail → pick sibling tertinggi |
| A-07 | Bundle variant → bandingkan availability per header, pick tertinggi |
| A-08 | Random SKU bisa di-bind ke Platform Product |
| A-09 | Random SKU **tidak** boleh Header/Detail BOM |
| A-10 | Random SKU **tidak** bisa PR/PO/inbound |
| A-11 | Benchmark COGS di SO line random — master inherit parent / sibling tertinggi untuk **validasi margin**; **bukan** acuan pecah harga jual bundle (lihat A-14) |
| A-12 | Availability random SKU selalu 0 |
| A-13 | Random SKU **diblok** di [Stock Remapping](../accounting-stock-remapping/requirement.md) — tidak boleh Origin maupun Remapped To |
| A-14 | **TO-BE:** Proporsi breakdown harga header bundle → child random memakai **Retail Price** SKU random (lalu Price Before VAT) — sama seperti child non-random. **Bukan** Benchmark COGS. [ETM-16216](https://erpintegration.atlassian.net/browse/ETM-16216) |
| A-15 | Setelah **Send to Default Waves** / processing, detail child sudah **SKU asli** — reprice / late booking price mengalokasi ke detail final itu (in-place), bukan rebuild dari template BOM random. [ETM-16212](https://erpintegration.atlassian.net/browse/ETM-16212) · [ETM-16216](https://erpintegration.atlassian.net/browse/ETM-16216) |

---

## 3. Validasi & Rules

| ID | Rule | Menu / trigger |
|----|------|----------------|
| V-01 | Non-stockable | `is_random` flag on product |
| V-02 | Reserved keyword `random` in SKU code | Block manual create |
| V-03 | BOM header/detail reject random | Bill of Material |
| V-04 | Platform binding: random confirmation or `-acak` mapping | Manage Platform Product (`config omni.random_is_acak`) |
| V-05 | Stock pick scoped to warehouse parent hierarchy | Send to Default Waves |
| V-06 | Sibling pick excludes random option variants | `getFifoProductRandom` |

---

## 4. Used In (matrix)

| Menu | Allowed | Behavior |
|------|---------|----------|
| Master Variant | Setup | Auto-add `random` option per type (**AS-IS**). **TO-BE:** create + **Set as Default System Product ON** + 1 option → **skip** inject `random` — [Master Variant §6.2](../supplychain-variant/requirement.md#62-eligibility--option-count--create-inject) |
| System Product (Variant) | ✅ Generate | `BTLMINUM-random` |
| Bundle Single/Variant | ✅ | Pick highest stock sibling/header; **breakdown harga** pakai Retail Price random (A-14), bukan Benchmark |
| Bill of Material | ❌ | Stockable only |
| Platform Product Binding | ✅ | With random rules |
| Sales Order (General/Platform) | ✅ | Line or `SalesOrderDetailRandom`; post-wave → SKU asli (A-15) |
| Send to Default Waves | ✅ | Primary trigger for auto-pick |
| PR / PO / Inbound | ❌ | Non-stockable |
| Benchmark COGS (master) | ✅ | Random variant **inherits parent MAX** via `ProductBenchmarkPriceJob` |
| Benchmark COGS (SO line) | ⚠️ | Often **0** on random-only platform lines pre-bind; post-bind may inherit random product row — see [Benchmark COGS](../accounting-product-benchmark-price/requirement.md) |

---

## 5. QA Test Scenarios

| # | Skenario | Expected |
|---|----------|----------|
| T-01 | Order variant `-random`, siblings A(10), B(5) stock | Pick A |
| T-02 | Stock only in different warehouse hierarchy | Pick fails / stock-error |
| T-03 | Bundle detail contains random | Validasi auto-approve khusus; benchmark master = parent MAX |
| T-04 | Bind platform SKU to random system product | Confirm or `-acak` match |
| T-05 | Try BOM with random header | Rejected |
| T-06 | Variant without random option selected | No `-random` SKU generated |

---

## Related Documents

| Doc | Path |
|-----|------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| System Product | [../system-product/requirement.md](../system-product/requirement.md) |
| Platform Product binding | [../manage-platform-product/requirement.md](../manage-platform-product/requirement.md) §12 |
| Benchmark COGS | [../accounting-product-benchmark-price/requirement.md](../accounting-product-benchmark-price/requirement.md) |
| Stock Remapping | [../accounting-stock-remapping/requirement.md](../accounting-stock-remapping/requirement.md) |
