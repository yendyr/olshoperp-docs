---
doc_type: e2e-test-case
tc_code: TC-SPLG-061
menu: omni-sales-platform
menu_name: "Dev - Sales Platform"
test_type: permission
title: "Permission: user tanpa izin Void dan Approve tidak melihat tombol Void di datalist maupun halaman edit meski SO eligible"
summary: "User tanpa izin Void/Approve tidak melihat tombol Void di kolom Action datalist maupun ikon Void Doc di halaman edit untuk SO Approved tanpa outbound Approved, dan datalist tetap terbuka normal; akun dengan izin pada SO yang sama melihat keduanya."
status: draft
owner: QA - Yemima
last_updated: 2026-10-19
requirement_ref: "card ETM-16431, card asal ETM-16276 (catatan teknis card: optimasi eager-load tidak boleh melemahkan gate permission Void di UI/aksi)"
automated: false
automated_spec: null
execution_company:
  id: 112
  code: FAT
related_menus: []
preconditions:
  - "Akun uji tanpa izin Void dan Approve: withoutvoid@olshoperp.com (kata sandi ada di tests/TEST-ACCOUNTS.md, tidak ditulis di TC ini); akun ini hanya untuk staging dan tyas"
  - "Akun itu punya akses melihat menu 'Dev - Sales Platform' dan bisa memilih company FAT (112)"
  - "Ada SO Platform eligible Void (Approved, tanpa Mutation Outbound Approved): SO-KKZ7DSRO"
  - "Pembanding: akun dengan izin approval (akun default E2E, rule 13 §4)"
test_data:
  - field: akun_tanpa_izin_void_approve
    value: "withoutvoid@olshoperp.com (staging dan tyas saja; kata sandi: lihat tests/TEST-ACCOUNTS.md)"
  - field: so_eligible_void
    value: "SO-KKZ7DSRO (id 2526909, Approved, tanpa outbound Approved)"
  - field: akun_pembanding
    value: "akun default E2E dengan izin approval (rule 13 §4)"
steps:
  - "Login https://staging.olshoperp.com/login sebagai withoutvoid@olshoperp.com; bila company awal bukan FAT, ganti: klik avatar profil di topbar → 'Switch Company' → 'FAT' → 'Proceed'"
  - "Buka sidebar 'Omni Channel' → 'Dev - Sales Platform' (https://staging.olshoperp.com/omni/sales-order); pastikan datalist terbuka normal (20 baris, teks 'Showing 1 to 20 of ... entries')"
  - "Isi kotak 'find something ...' dengan SO-KKZ7DSRO, Enter → 1 baris; geser tabel ke kolom 'Action' paling kanan — hanya tombol buka (ikon edit); tidak ada tombol 'Void' (tooltip-void)"
  - "Buka halaman edit https://staging.olshoperp.com/omni/sales-order/edit/2526909; hover semua ikon di toolbar kanan atas — hanya 'Print Detail', 'Sync Sales Order', 'Duplicate'; tidak ada ikon 'Void Doc'"
  - "Catat respons API (DevTools): baris datalist can_void=false dan action.voidable=false; detail SO can_void=false dan can_closed=false; pantau console (0 error/warn) dan tidak ada panggilan status 4xx/5xx"
  - "Logout, login sebagai akun pembanding (punya izin approval), ulangi langkah 2 sampai 4 untuk SO yang sama — tombol 'Void' ada di kolom 'Action' dan ikon 'Void Doc' ada di toolbar halaman edit"
  - "Jangan klik Void, Closed, maupun Unapprove pada SO mana pun"
expected_result: |
  1. Datalist Dev - Sales Platform tetap terbuka normal untuk user tanpa izin Void/Approve (baris, total entries, tanpa error).
  2. Pada SO eligible Void, kolom Action user tersebut tidak memuat tombol Void.
  3. Pada halaman edit SO yang sama, ikon Void Doc tidak tampil.
  4. Pembanding: akun dengan izin approval melihat tombol Void di datalist dan ikon Void Doc di halaman edit untuk SO yang sama, sehingga perbedaannya terbukti karena izin.

  [CATATAN QA] requirement.md belum merinci gate izin Void pada Sales Platform; expected mengacu pada deskripsi card ETM-16431. Temuan di luar expected: tombol Unapprove tetap tampil di halaman edit SO Approved untuk user tanpa izin approve (can_unapprove=true); menurut kode SalesOrder::canUnapprove hanya mengecek status dan wave, tanpa izin, sementara server memeriksa izin saat aksi dijalankan (belum dibuktikan dengan klik). Konfirmasi ke QA lead apakah perlu card terpisah.
test_result:
  status: passed
  started_at: "2026-10-19T16:08:17+07:00"
  finished_at: "2026-10-19T16:13:00+07:00"
  executed_by: "Bugsy (Claude, login withoutvoid@olshoperp.com; pembanding playwright@gmail.com)"
  environment: staging
  log_summary: "withoutvoid: datalist normal (20 baris, 586.297 entries); SO-KKZ7DSRO kolom Action hanya tombol buka, respons can_void=false dan voidable=false; halaman edit tanpa ikon Void Doc (toolbar: Print Detail, Sync Sales Order, Duplicate), respons detail can_void=false. Pembanding playwright@gmail.com: tombol Void ada (voidable=true) dan ikon Void Doc ada. Console 0 error/warn, 0 API gagal. Temuan: tombol Unapprove tetap tampil untuk withoutvoid."
  report_url: "https://drive.google.com/drive/folders/1A_7xgT5YlavL-wLGnPDWbNtjirqu7oaI"
test_data_used:
  - "SO-KKZ7DSRO"
run_history: []
origin_jira: ETM-16431
first_execution:
  at: "2026-10-19"
  via: "manual:Bugsy"
  jira: ETM-16431
last_execution:
  at: "2026-10-19"
  jira: ETM-16431
  status: passed
  via: "manual:Bugsy"
  notes: "Dijalankan oleh Claude (peran Bugsy) atas permintaan Yemima, 19-10-2026 16:08-16:13 WIB, staging, company FAT (112), login withoutvoid@olshoperp.com dengan pembanding playwright@gmail.com lewat UI crawl otomatis. Actual: user tanpa izin Void tidak melihat tombol Void di kolom Action maupun ikon Void Doc di halaman edit untuk SO-KKZ7DSRO, datalist tetap normal, sedangkan akun dengan izin melihat keduanya; SO tidak diubah, console tanpa error. Temuan sampingan: tombol Unapprove tetap tampil untuk user tanpa izin approve."
---

# TC-SPLG-061 — User tanpa izin Void tidak melihat tombol Void

Card: [ETM-16431](https://erpintegration.atlassian.net/browse/ETM-16431) (Test Case, permission) · card asal: [ETM-16276](https://erpintegration.atlassian.net/browse/ETM-16276)

## Retest cepat
1. Login staging sebagai `withoutvoid@olshoperp.com` (kata sandi di `tests/TEST-ACCOUNTS.md`), company **FAT (112)**.
2. **Omni Channel → Dev - Sales Platform**, cari **SO-KKZ7DSRO**: kolom **Action** tanpa tombol **Void**; halaman edit tanpa ikon **Void Doc**.
3. Bandingkan dengan akun yang punya izin approval: tombol dan ikon itu ada. Jangan klik Void/Closed/Unapprove.

## Catatan QA

### Akun uji
- `withoutvoid@olshoperp.com`: bisa melihat Sales Order, **tanpa izin Void dan Approve**. **Hanya untuk staging dan tyas.** Kata sandi dan aturan pakai ada di `tests/TEST-ACCOUNTS.md` (sengaja tidak ditulis di TC karena file TC dimirror ke repo developer dan Help Center).

### Data uji (FAT, 112)
| SO | Status | Outbound Approved | URL edit |
|---|---|---|---|
| SO-KKZ7DSRO | Approved | tidak ada | https://staging.olshoperp.com/omni/sales-order/edit/2526909 |

### Hasil perbandingan (19-10-2026)
| Titik masuk | withoutvoid | Akun dengan izin |
|---|---|---|
| Kolom Action datalist | hanya buka | buka, cetak, Void |
| Respons baris | can_void=false, voidable=false | can_void=true, voidable=true |
| Toolbar halaman edit | Print Detail, Sync Sales Order, Duplicate | + Void Doc |

### Observasi
- Tombol **Unapprove** (merah, kanan bawah halaman edit) tetap tampil untuk user tanpa izin approve pada SO Approved (respons `can_unapprove=true`). Belum dibuktikan apakah klik-nya ditolak server; belum dibuatkan card.
- Tombol Print tidak tampil di kolom Action untuk akun tanpa izin (printable=false); di luar cakupan card.
- Pelajaran metode: cek ikon toolbar halaman edit lewat DOM/hover, bukan hanya teks halaman (lihat TC-SPLG-058).
- Evidence (teks): https://drive.google.com/drive/folders/1A_7xgT5YlavL-wLGnPDWbNtjirqu7oaI
