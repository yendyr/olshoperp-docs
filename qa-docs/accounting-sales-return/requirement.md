---
doc_type: requirement
menu: accounting-sales-return
menu_name: "Sales Return"
version: 3.2
last_updated: 2026-11-12
owner: QA - Yemima
status: review
---

# Sales Return Approval — Requirement (Finance Layer)

**Modul:** Finance Accounting  
**Audience:** Finance, QA, Developer  
**Persona:** Team Finance — review harga/COGS, **Complete** approval, jurnal turunan

**UI route:** `/accounting/sales-return`  
**Canonical E2E doc:** [supplychain-sales-returns/requirement.md](../supplychain-sales-returns/requirement.md)  
**Related:** [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764) — CN dari SR → Deposit of Sales Return · [ETM-17064](https://erpintegration.atlassian.net/browse/ETM-17064) — definisi Billed/Unbilled = keberadaan SI (parity Purchase Return)

---

## 0. Changelog

| Version | Date | Changes |
|---------|------|---------|
| 3.2 | 2026-11-12 | SCM §7.5 bagian E: slot Deposit of Sales Return di Store dan pembacaan akun dari Store untuk Credit Note order platform diputuskan sebagai TO-BE (card ETM-17378 Improvement: field baru di Store, pilihan COA wajib dari company Default Owner Data dan dicek di backend; card ETM-17379 Change Requirement: sumber baca dipindah ke Store). Perilaku saat ini (slot company) tetap berlaku sampai rilis |
| 3.1 | 2026-11-12 | Tambah SCM §7.5: retur order platform dari setting Store sampai jurnal, termasuk dua jenis pemilik Store (owned_by vs Default Owner Data), larangan ganti owner setelah ada transaksi, tabel akun Deposit of Sales Return per jenis order (customer general memakai slot customer; platform memakai slot company pemilik transaksi; Store tidak punya slot), contoh nyata Staging (CN-5V11936P; Store 30 / SO-698ACD90) dan keputusan terbuka slot Deposit of Sales Return di Store |
| 3.0 | 2026-11-12 | Koreksi jurnal retur Billed: jurnal retur hanya Return Inventory (D) / COGS (K); Credit Note adalah dokumen terpisah (otomatis Approved) dengan jurnal sendiri Sales COA (D) / Deposit of Sales Return (K), bukan "Credit Note (D) / AR (K)"; piutang turun saat CN dipakai di Account Receive, bukan saat Complete. Contoh nyata Billed: SO-5V1113IU / SR-5V116RYM / CN-5V11936P. Catatan: hapus SR Unbilled lama tidak mengembalikan prepared_to_amount_return di SI |
| 2.9 | 2026-11-12 | GAP-SR-16 (SCM §7.4): contoh angka fiktif (25 pcs) diganti dua dokumen nyata Staging dengan jurnal tiap tahap: SO-4NBJN4UH (retur lama sudah Complete, Penjualan dan Piutang terbalik, benar) dan SO-5U1VSXC7 (retur lama masih Open; bila di-Complete sekarang Piutang Rp 11.853.408 tidak terbalik). Tambah catatan: belum ada contoh nyata 'retur dulu, SI kemudian' |
| 2.8 | 2026-11-12 | GAP-SR-16: tambah contoh angka yang tidak ambigu (urutan retur dulu lalu SI = piutang 48.000; SI dulu lalu retur Unbilled lama = piutang tetap 50.000), pembanding Purchase Return end to end (Billed/Unbilled dipilih di header, qty dibagi per qty, Supplier Invoice dikurangi qty retur, approve tanpa cek status invoice), dan penjelasan Failed Ship vs retur pada qty SI. Gate di Complete dilacak di card ETM-17365 (Error, Highest, Alvin) |
| 2.7 | 2026-11-12 | Koreksi GAP-SR-16 (SCM §7.4): jalur pembuat SI setelah retur ada (daftar baris SI, impor SI, auto-generate SI, impor Settlement) sudah mengurangi qty yang diretur, jadi skenario SI baru approve setelah retur Unbilled dibuat hanya mungkin lewat API langsung. Yang terbukti: Complete tidak punya gate status SI, sehingga retur Unbilled lama yang SI-nya sudah approve (18 di Staging) bisa di-Complete tanpa pembalik Sales/AR. Deskripsi header SR tidak bisa diedit lewat aplikasi (update hanya menerima transaction_date) |
| 2.6 | 2026-11-12 | GAP-SR-16 dilengkapi kronologi dan skenario (SCM §7.4): SI yang masih Open ditolak saat Create Return, sehingga tidak masuk Billed maupun Unbilled. Retur Unbilled tidak punya pembalik Sales/AR bila SI baru approved setelah retur dibuat, atau bila retur lama (definisi lama, dibuat sebelum 10 Nov 2026) masih Open. Staging 12 Nov 2026: 64 dari 66 retur Unbilled (97,0%) bertaut SI approved, 18 di antaranya masih Open. Dicatat sebagai gap docs; belum ada card Jira. ETM-17064 / ETM-17291 |
| 2.5 | 2026-11-12 | Jurnal retur Unbilled (belum ada SI) hanya mengembalikan sisi barang: Return Inventory (D) / COGS (K) (+ Expense / Inventory bila Lost). Tanpa Sales (D) / AR (K): belum ada penjualan atau piutang yang tercatat untuk dibalik. Parity Purchase Return Unbilled (Unbilled Goods (D) / Persediaan (K), tanpa Hutang Usaha dan Debit Note). GAP-SR-16: cabang kode jurnal Sales/AR untuk Unbilled masih ada tetapi bernilai 0. Docs lama menyebut Sales/AR (definisi Unbilled lama = SI belum dibayar). ETM-17064 / TC ETM-17291 |
| 2.4 | 2026-11-04 | Export All sama dengan menu gudang: tanpa rincian 1 baris per dokumen, dengan rincian 1 baris per SKU. Menu Finance mengisi harga/COGS. Angka dokumen tanpa detail masih 0 (kontrak `-`, GAP-SR-15). Kolom Show/Hide belum dihormati (GAP-SR-14 / ETM-17067) |
| 2.3 | 2026-11-04 | Minimal satu qty lebih dari 0 dicek di level dokumen saat Complete, bukan per baris saat save (ETM-17054) |
| 2.2 | 2026-11-04 | **Billed = sudah ada SI**; **Unbilled = belum ada SI** (bukan status AR/payment). Parity Purchase Return → Debit Note. Gap code [ETM-17064](https://erpintegration.atlassian.net/browse/ETM-17064) |
| 2.1 | 2026-10-22 | Cross-ref TO-BE ETM-16764: CN dari billed Complete memakai Deposit of Sales Return; Account Receive ikut akun itu |
| 2.0 | 2026-07-05 | Initial Finance layer — split from canonical SR v2.0 |

---

## 1. Scope menu Finance

| Aspek | Finance menu | SCM menu (referensi) |
|-------|--------------|----------------------|
| Route | `/accounting/sales-return` | `/supplychain/sales-returns` |
| Scan/create | ✓ (same ScanForm) | ✓ |
| Input qty | ✓ | ✓ |
| Kolom harga/COGS | ✓ **with_price=1** | ❌ |
| Tombol **Complete** | ✓ | ❌ hidden |
| Approve gate | `approval` privilege | `approval => 0` |

---

## 2. Kolom tambahan Finance (Product Detail)

Query: `GET accounting/sales-returns/{id}/details?with_price=1`

| Kolom | Posisi | Keterangan AS-IS |
|-------|--------|------------------|
| **Order Price / Order COGS** | After Product | Total price & COGS untuk full order qty |
| **Return Price / Return COGS** | After Total SR Qty | Proporsional terhadap Total SR Qty — dinamis saat qty berubah |

### 2.1 COGS Return — 7 Mei 2026

| Layer | Rule |
|-------|------|
| **Backend** | Average: `Σ(outbound_qty × stock price) / Σ outbound_qty` per order detail |
| **FE tooltip** | Masih menyebut *"most recent Stock ID date"* — drift (GAP-SR-02) |

Return Price dari invoice: `each_price_after_discount_after_vat × return qty`.

---

## 3. Tombol Complete & Approval

**Komponen:** `DetailButtons.vue` — `Complete` visible when `can_approve && !fromScm`

**API:** `POST accounting/sales-returns/{id}/approve`

Body: `{ approval_status: 'approved', description?: string(max 150) }`

**Pre-conditions:** status open; min 1 qty lebih dari 0 **pada level dokumen** (bukan per baris SKU), dicek saat Complete; Return Expense COA if lost; product COA valid; fiscal period open.

Jika seluruh dokumen Restock + Broken + Lost = 0, Complete ditolak: `Please enter at least one restock quantity, broken quantity, or lost quantity`.

Satu baris SKU 0/0/0 tetap boleh disimpan (retur parsial). Save detail hanya menolak bilangan non-bulat dan total yang melebihi qty yang masih bisa diretur. Pesan lama per baris `Total return quantity must be greater than 0 to save this document.` tidak dipakai lagi ([ETM-17054](https://erpintegration.atlassian.net/browse/ETM-17054)). Contoh dan tabel validasi: [supplychain-sales-returns §5.2](../supplychain-sales-returns/requirement.md).

**Reject:** tidak ada endpoint/button aktif (GAP-SR-10).

---

## 4. Transaksi turunan setelah Complete

| Sub-proses | Dokumen generated |
|------------|-------------------|
| Restock | `ItemStock` inbound ke Return WH |
| Broken | Transfer Internal → Scrap WH (auto-approved) |
| Lost | Stock Deduction + Expense journal |

### 4.1 Jurnal (`JournalProcess::stockSalesReturnAutoJournal`)

**UNBILLED:** Return Inventory (D)/COGS (K) · Expense (D)/Inventory (K) if Lost. **Tanpa** Sales (D)/AR (K).

**BILLED:** jurnal retur: Return Inventory (D)/COGS (K) · Expense (D)/Inventory (K) if Lost. **Credit Note** otomatis Approved sebagai dokumen terpisah dengan jurnal sendiri: Sales COA (D) / Deposit of Sales Return (K). Contoh nyata Staging: SR-5V116RYM (GL-EAMJ1K6TXIDS: Persediaan 200.000 (D) / HPP 200.000 (K)) dan CN-5V11936P (GL-EAMJ1KCSLEMY: Penjualan Produk 200.000 (D) / Retur Penjualan 200.000 (K)). Piutang (AR) turun saat CN dipakai di Account Receive, bukan saat Complete

**Kenapa Unbilled tanpa Sales/AR:** belum ada Sales Invoice, jadi belum ada penjualan atau piutang yang tercatat dan perlu dibalik. Yang dibalik hanya sisi barang (outbound: HPP / Persediaan). Pola sama dengan Purchase Return: **Unbilled** = Unbilled Goods (D) / Persediaan (K) tanpa Hutang Usaha dan tanpa Debit Note; **Billed** = Hutang Usaha (D) / Persediaan (K) + Debit Note. Contoh Staging: jurnal retur Unbilled sampai 9 Nov 2026 (mis. GL-EAFDXUYFLQ4W, GL-EAFE411P5332, GL-EAKP0CS5RGEU) masih memuat Penjualan Produk (D) / Piutang Usaha (K); jurnal SR-5V10Z5K7 (GL-EAMIDFM6LEYK, 11 Nov 2026) hanya Return Inventory 2.000 (D) / HPP 2.000 (K).

**GAP-SR-16 (Open, dicatat sebagai gap docs):** kode `stockSalesReturnAutoJournal` masih memanggil cabang Sales/AR untuk Unbilled. Sejak [ETM-17064](https://erpintegration.atlassian.net/browse/ETM-17064) harganya dibaca dari Sales Order lewat atribut yang tidak ada di model, nilainya 0, sehingga baris tidak tertulis (hasil benar karena kebetulan). Akibat nyata: retur Unbilled lama (definisi lama) yang SI-nya sudah approve tidak punya pembalik Sales/AR dan tidak punya Credit Note, dan Complete tidak menolaknya karena tidak ada gate status SI. SI yang masih Open ditolak saat Create Return, jadi tidak masuk Billed maupun Unbilled. Staging 12 Nov 2026: 64 dari 66 retur Unbilled (97,0%) bertaut SI approved, 18 di antaranya masih Open. Kronologi, contoh nyata Staging (SO-4NBJN4UH, SO-5U1VSXC7), dan pembanding Purchase Return: [supplychain-sales-returns §7.4](../supplychain-sales-returns/requirement.md). Gate di Complete dilacak di card [ETM-17365](https://erpintegration.atlassian.net/browse/ETM-17365).

### 4.2 Credit Note (billed)

Auto jika baris retur **Billed** (SKU/baris **sudah punya Sales Invoice**) → `generateCreditNoteFromReturn` — mirror generate **Debit Note** pada Purchase Return billed, sampai penjurnalan.

**Bukan** syarat “invoice sudah ada Account Receive / `processed_to_payment_amount > 0`”.

**Akun deposit per jenis order:** customer general memakai slot customer lalu company; order platform (aktor Store) memakai slot company pemilik transaksi, bukan setting Store. Penjelasan dan contoh end to end: [supplychain-sales-returns §7.5](../supplychain-sales-returns/requirement.md). **TO-BE:** order platform membaca slot Deposit of Sales Return milik Store ([ETM-17378](https://erpintegration.atlassian.net/browse/ETM-17378), [ETM-17379](https://erpintegration.atlassian.net/browse/ETM-17379)).

**COA deposit (TO-BE [ETM-16764](https://erpintegration.atlassian.net/browse/ETM-16764)):** Approve CN dari SR billed → Credit **Deposit of Sales Return** (bukan Customer's Deposit). Saat CN dipakai di Account Receive, Debit harus ke akun **yang sama**.

Detail: [Credit Note §6.7–6.8.1](../accounting-credit-note/requirement.md).

### 4.3 Completion Summary (PM)

PM mensyaratkan dialog `Sales Return Processed` + Print Summary — **not implemented** (GAP-SR-08/09, P-SR-01).

---

## 5. Billed vs Unbilled

Definisi wajib **konsisten dengan Purchase Return** (Billed = sudah ada invoice pembelian; Unbilled = belum). **Tidak berhubungan dengan AR / status payment.**

| Type | Set when | Finance impact |
|------|----------|----------------|
| `unbilled` | SKU/baris **belum punya Sales Invoice (SI)** | Jurnal sisi barang saja: Return Inventory (D) / COGS (K). Tanpa Sales/AR dan tanpa Credit Note |
| `billed` | SKU/baris **sudah punya SI** | Jurnal retur sisi barang + Credit Note otomatis (Sales COA (D) / Deposit of Sales Return (K)); AR turun saat CN dipakai di Account Receive (parity PR billed → Debit Note) |

**Contoh:** satu SO punya dua SI — satu sudah dilunasi AR, satu belum ada AR. Keduanya punya SI → **keduanya Billed** (bukan dipecah karena status payment).

**Gap code (AS-IS salah):** implementasi masih memakai `processed_to_payment_amount > 0` → [ETM-17064](https://erpintegration.atlassian.net/browse/ETM-17064) / GAP-SR-13.

---

## 6. Auto-approve (background)

Config: `omnichannel/sales-return-configuration` — `auto_approve`, `open_to_approve_duration` (minutes).

Command: `php artisan salesreturn:auto-approve` → `SalesReturnAutoApproveJob`.

Finance harus aware: SR open lebih lama dari duration bisa auto-approved tanpa manual Complete.

---

## 7. Acceptance Criteria (Finance QA)

1. Complete button hanya di `/accounting/sales-return`, tidak di SCM edit
2. Kolom Order/Return Price & COGS tampil dengan `with_price=1`
3. Approve billed (ada SI) → Credit Note ter-create — termasuk SI yang belum ada AR
4. Approve unbilled (belum ada SI) → jurnal hanya Return Inventory (D) / COGS (K), tanpa Sales/AR dan tanpa CN (parity Purchase Return Unbilled; ETM-17291)
5. Definisi Billed/Unbilled tidak memakai status payment/AR (parity Purchase Return; ETM-17064)
6. Lost qty tanpa Return Expense COA → approve blocked
7. COGS return value = average outbound (bukan latest stock date)
8. Partial return → remainder omni return duplicated
9. Baris SKU 0/0/0 tersimpan; Complete ditolak hanya jika tidak ada satupun qty lebih dari 0 di dokumen (ETM-17054)
10. Export All mengikuti [supplychain-sales-returns §9.1–9.2](../supplychain-sales-returns/requirement.md). Menu ini mengisi Order/Return Price dan COGS (`with_price` true). Dokumen tanpa detail: angka masih 0, bukan `-` (GAP-SR-15). Kolom yang di-hide masih ada di Excel (GAP-SR-14 / ETM-17067)

---

## 8. Export All

Kontrak lengkap, contoh 2 SKU, dan gap ada di [Sales Return SCM §9](../supplychain-sales-returns/requirement.md). Ringkas untuk menu Finance:

| Mode | Hasil |
|------|-------|
| **Without Details** | 1 baris Excel = 1 dokumen, sama dengan datalist |
| **With Details** | 1 baris Excel = 1 SKU. N SKU → N baris. Kolom header diulang. Kolom detail: SKU, Product Name, Variant, Order Price/COGS, Product Qty, Return Price/COGS, Outstanding Qty, Restock Qty, Lost, Broken, Total Return Qty, Unit |

**Harga:** menu ini mengisi Order Price, Order COGS, Return Price, dan Return COGS. Menu gudang menulis keempat nilai itu 0.

**Tanpa baris detail:** dokumen tetap 1 baris. Kontrak ETM-10609: kolom detail `-`. AS-IS: teks sudah `-`, angka masih 0 (GAP-SR-15, [ETM-17067](https://erpintegration.atlassian.net/browse/ETM-17067)).

**Show/Hide Column (TO-BE):** kolom yang disembunyikan tidak boleh muncul di header maupun sel. Backend belum menerima atau menyaring kolom tersembunyi (GAP-SR-14, kartu yang sama). Contoh: sembunyikan Assignee atau Trx. Ref — kedua kolom masih ada di file.

**Contoh:** dokumen 2 SKU `HOME-DEC-CORTRAYWOOD` dan `TECH-ACC-MULTICARDREADER` → Without Details 1 baris; With Details 2 baris, harga terisi di menu ini.

---

## Related Documents

| Doc | Path |
|-----|------|
| Canonical SR | [../supplychain-sales-returns/requirement.md](../supplychain-sales-returns/requirement.md) |
| KB Finance | [knowledge-base.md](./knowledge-base.md) |
| Technical | [technical.md](./technical.md) |
| Credit Note | [../accounting-credit-note/README.md](../accounting-credit-note/README.md) |
