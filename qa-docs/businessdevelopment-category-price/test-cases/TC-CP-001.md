---
doc_type: e2e-test-case
tc_code: TC-CP-001
menu: businessdevelopment-category-price
menu_name: "Category Price"
test_type: negative
title: "Update from Master tidak loop/duplikasi, hapus band/tier langsung hilang, snapshot WIB, tier baru tanpa ikon oranye (retest ETM-16638)"
summary: "Retest card Error ETM-16638 di form edit Category Price: jam Snapshot tier = jam lokal/Audit Log (WIB), tier yang baru ditambah tidak bertanda edited, hapus band dan hapus tier langsung hilang dari UI dan tetap hilang setelah reload, dan Update from Master menyinkronkan band tiap tier ke master tepat satu kali tanpa request berulang atau tier/band dobel."
status: draft
owner: QA - Yemima
last_updated: 2026-10-20
requirement_ref: "qa-docs/businessdevelopment-category-price/knowledge-base.md (Update from Master, icon oranye) + technical.md (Tier accordion snapshot datetime, dirty vs master); card ETM-16638 (Error, relates ETM-16313, ETM-16576)"
automated: false
automated_spec: null
execution_company:
  id: 13
  code: DEV-STG
related_menus:
  - businessdevelopment-variable-price
preconditions:
  - "Login staging https://staging.olshoperp.com dengan playwright@gmail.com; company aktif Dev Staging (13) — master QA-VP-E2E-AM / QA-VP-EMPTY / QA-VP-E2E-WGT hanya ada di company ini (FAT 112 tidak punya)"
  - "Master Variable Price aktif: QA-VP-E2E-AM (id 53, 3 band), QA-VP-EMPTY (id 8, 2 band), QA-VP-E2E-WGT (id 55, 3 band)"
  - "Pakai Category Price BARU (snapshot lama yang tersimpan UTC tidak ikut berubah, catatan dev)"
  - "Pantau request API (DevTools Network / logger Playwright page.on('requestfinished')) host api.staging.olshoperp.com"
test_data:
  - field: category_price
    value: "QA-16638-2010 — QA ETM-16638 20-10-2026 (id 59, Dev Staging, Show for all company ON) — https://staging.olshoperp.com/businessdevelopment/pricelist-category/edit/59"
  - field: tier_akhir
    value: "Tier 1 QA-VP-E2E-AM (tier id 350), Tier 2 QA-VP-E2E-WGT (352), Tier 3 QA-VP-EMPTY (353), semua = master per 20-10-2026 09:09:37 WIB"
steps:
  - "Switch company ke Dev Staging (13): avatar topbar > Switch Company > Dev Staging > Proceed"
  - "Business Development > Price > Category Price > Create: Code QA-16638-2010, Name 'QA ETM-16638 20-10-2026', Description label ETM-16638, klik Save (halaman create hanya punya Save; setelah simpan buka edit/{id})"
  - "Di edit/{id}, Select Variable Price: QA-VP-E2E-AM (Tier 1) lalu QA-VP-EMPTY (Tier 2). Catat jam klik (WIB), teks 'Snapshot dd-mm-yyyy HH:mm:ss' di header tier, dan baris Audit Log 'Variable Price Tier created'. Cek tidak ada ikon oranye (span.text-warning, title 'This tier was edited ...') di tier baru"
  - "Tier QA-VP-E2E-AM: klik tombol hapus merah di baris band terakhir. Baris harus langsung hilang (band sebelumnya jadi Unlimited)"
  - "Tier QA-VP-EMPTY: klik ikon trash header (Remove tier) > Remove. Accordion harus langsung hilang, badge Variable Price Tiers berkurang"
  - "Reload: band dan tier yang dihapus tetap hilang; hitung request API 30 dtk (harus hanya sekali load)"
  - "Klik Update from Master > Update. Hitung request API 60-80 dtk: harus 1x POST pricelist-category/update-from-master/{id} + 1x GET pricelist-category/tiers/{id}, tanpa pengulangan. Jumlah tier dan band = master"
  - "Reload + diam 45 dtk: tidak ada request berulang, tier/band tidak bertambah"
  - "Regresi multi-tier: tambah QA-VP-E2E-WGT + QA-VP-EMPTY, langsung edit Value band tier baru (tier tidak boleh dobel), ganti Type band Amount > Percentage (autosave), lalu Update from Master lagi dan ulangi hitung request + reload"
  - "Bandingkan API GET https://api.staging.olshoperp.com/api/businessdevelopment/pricelist-category/tiers/{id} vs GET .../variable-price/{vp_id} (margins: start/end/type/margin_value/is_last)"
expected_result: |
  1. Jam Snapshot di header tier = jam lokal/Audit Log (WIB), bukan UTC (-7 jam).
  2. Tier yang baru ditambahkan tidak langsung bertanda edited (tanpa ikon oranye).
  3. Hapus band dan hapus tier langsung menghilangkan elemen dari UI setelah request sukses, dan tetap hilang setelah reload.
  4. Update from Master menyinkronkan band setiap tier ke masternya tepat satu kali: tidak ada tier/band dobel dan tidak ada request berulang (loop), baik setelah klik maupun setelah reload.
test_result:
  status: passed
  started_at: "2026-10-20T09:00:03+07:00"
  finished_at: "2026-10-20T09:11:35+07:00"
  executed_by: "Bugsy (Grok Bot, login playwright@gmail.com)"
  environment: staging
  log_summary: "P1 Snapshot 09:01:54 / 09:02:09 = Audit Log 09:01:54 / 09:02:09 = jam klik WIB. P2 tier baru (4 kali attach) tanpa ikon oranye; ikon hanya muncul setelah band diedit. P3 band terakhir QA-VP-E2E-AM dan tier QA-VP-EMPTY langsung hilang (PUT 200 lalu GET tiers), tetap hilang setelah reload (1 tier, 2 band). P4 UFM #1 (1 tier) dan UFM #2 (3 tier) masing2 hanya 1 POST update-from-master + 1 GET tiers selama 58-80 dtk; reload + 45 dtk idle = 15 request sekali load; tier/band API = master (3/3/2 band)."
  report_url: "https://drive.google.com/drive/folders/167QtP9hNLYjDibgRL6DVd9nbgEDJ2dgU"
test_data_used:
  - "QA-16638-2010 (Category Price id 59, Dev Staging)"
run_history:
  - at: "2026-10-20"
    status: passed
    environment: staging
    note: "Retest ETM-16638 4/4 poin PASS. Catatan kecil: console TypeError 'Cannot read properties of undefined (reading data)' di Form-*.js tiap buka/reload halaman edit, tanpa dampak terlihat."
origin_jira: ETM-16638
first_execution:
  at: "2026-10-20"
  via: "manual:Bugsy"
  jira: ETM-16638
last_execution:
  at: "2026-10-20"
  jira: ETM-16638
  status: passed
  via: "manual:Bugsy"
  notes: "Dijalankan Bugsy (Grok Bot) via /bugsy, 20-10-2026 09:00-09:11 WIB, staging, company Dev Staging (13), login playwright@gmail.com, data QA-16638-2010 (id 59). Jira tidak diubah (card Error di QA Review)."
---

# Retest ETM-16638 — Update from Master loop, hapus tier/band, snapshot WIB

Card: [ETM-16638](https://erpintegration.atlassian.net/browse/ETM-16638) (Error, Highest) · relates [ETM-16576](https://erpintegration.atlassian.net/browse/ETM-16576), [ETM-16313](https://erpintegration.atlassian.net/browse/ETM-16313)

## Konteks
- Bug awal (19-10-2026): klik **Update from Master** memicu request tanpa henti, tier/band dobel (QA-VP-E2E-AM/WGT >20 band, 8 tier QA-VP-AuditLogHeaderSaja); hapus band/tier tercatat di Audit Log tapi UI tidak berubah; Snapshot tampil UTC (07:27 vs Audit Log 14:27); tier baru langsung ikon oranye.
- Catatan dev: snapshot lama yang sudah tersimpan UTC tidak berubah, jadi uji pakai tier baru. Regresi yang disebut dev: daftar tier ikut company aktif; ganti Type band Percentage/Amount autosave; tambah tier lalu langsung edit band tidak boleh menduplikasi tier.
- Frontend memakai **PUT pricelist-category/{id}** (simpan seluruh tier) untuk attach, hapus band, hapus tier, edit band; lalu **GET pricelist-category/tiers/{id}**. Update from Master = **POST pricelist-category/update-from-master/{id}**.
- Penanda edited = `span.text-warning` di header tier (title "This tier was edited in this Category Price, so it no longer matches the Variable Price master.").

## Retest cepat
1. Staging, company **Dev Staging (13)** → Category Price → buat data baru → buka edit.
2. Tambah 2 tier, cek jam Snapshot = Audit Log (WIB) dan tidak ada ikon oranye.
3. Hapus band terakhir tier 1 dan Remove tier 2 → langsung hilang → reload tetap hilang.
4. Update from Master → Update; pantau Network ±60 dtk dan setelah reload: hanya 1 POST + 1 GET, jumlah tier/band = master.

## Data uji (Dev Staging, 13) — tidak dihapus
| Data | Keterangan | URL |
|---|---|---|
| QA-16638-2010 / "QA ETM-16638 20-10-2026" | Category Price id 59, deskripsi berlabel ETM-16638 20-10-2026, 3 tier = master | https://staging.olshoperp.com/businessdevelopment/pricelist-category/edit/59 |
| Master QA-VP-E2E-AM (53) | 0-10.000 Rp1.000 · 10.001-20.000 Rp3.000 · 20.001-∞ 5% | /businessdevelopment/variable-price |
| Master QA-VP-E2E-WGT (55) | 1-1.000 Rp900 · 1.001-2.000 10% · 2.001-∞ 5% | |
| Master QA-VP-EMPTY (8) | 0-1.000 Rp1.000 · 1.001-∞ 0% | |

## Hasil 20-10-2026 (09:00-09:11 WIB) — PASSED 4/4
| # | Poin | Hasil | Observasi |
|---|---|---|---|
| 1 | Snapshot WIB | ✅ | Attach 09:01:52 → Snapshot 20-10-2026 09:01:54, Audit Log 09:01:54; tier 2 Snapshot 09:02:09 = Audit Log 09:02:09; `last_sync_at` API juga WIB |
| 2 | Tier baru tanpa ikon oranye | ✅ | 4 kali attach (AM, EMPTY, WGT, EMPTY lagi) tanpa `text-warning`; ikon muncul hanya setelah band diedit, hilang lagi setelah UFM |
| 3 | Hapus band/tier hilang dari UI | ✅ | Band terakhir AM hilang langsung (3→2 band); Remove tier EMPTY → tiers 2→1; setelah reload tetap 1 tier/2 band (API sama) |
| 4 | UFM sekali, tanpa loop/duplikasi | ✅ | UFM #1: 2 request (POST+GET) dalam ~80 dtk, AM kembali 3 band. UFM #2 (3 tier, 2 diedit): 2 request dalam ~58 dtk, band AM/WGT/EMPTY = 3/3/2 = master. Reload + 45 dtk idle: 15 request sekali load, tanpa ulangan |

Regresi: tambah tier lalu langsung edit band → tetap 3 tier (tidak dobel), 1 PUT; ganti Type band Amount→Percentage → autosave 1 PUT; daftar Variable Price mengikuti company aktif (FAT tidak punya QA-VP-E2E-*, Dev Staging punya). Catatan kecil: console `TypeError: Cannot read properties of undefined (reading 'data')` di `Form-*.js` tiap load halaman edit, tanpa dampak terlihat.

## Bukti (Drive "Temuan Bugsy")
- Poin 1-2: https://docs.google.com/document/d/1c-xgw1N43t_590PY8sMrc8ggTWhyjLQo3eL6etQ_V6s/view
- Poin 3: https://docs.google.com/document/d/1UCbSebChfuYCjY54DwQ6cKeV4qCvWZ413TusZUH-wqw/view
- Poin 4: https://docs.google.com/document/d/153bWh6cEqilc6o_zaTZM_EiZHoVYqenB8OEW98_0L54/view
- Network log: https://drive.google.com/file/d/1-hmLBiht24nAgM2Rgz2PvrbQJTghsJKy/view

Jira: tidak diubah (card Error, bukan Test Case).
