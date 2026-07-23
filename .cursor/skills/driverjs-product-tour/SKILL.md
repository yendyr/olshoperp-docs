---
name: driverjs-product-tour
description: >-
  Mengisi / merancang product tour driver.js per menu OlshopERP setelah FE
  tour hooks siap. Pakai saat user minta tour, onboarding, guided tour,
  driver.js, "isi tour", "tour: {menu}", atau buat tour datalist/breadcrumb.
---

# Driver.js Product Tour — Pola OlshopERP

## Workflow tim (sumber kebenaran)

```
1. Developer bikin tampilan + pasang hook tour (data-tour / selector)
2. User pull FE
3. User minta agent → isi step / popover / aksi yang perlu
```

Agent **bukan** yang pertama membangun UI tour. Fokus isi konten & wiring step ke hook yang sudah ada di FE.
Untuk menu datalist baru: agent boleh menambah file `src/config/tours/...`, import registrasi di `DataList.vue`, dan class hook `tour-*` pada tombol penting bila belum ada.

| Fase | Siapa | Agent lakukan |
|------|-------|---------------|
| **FE siap** (default) | Dev sudah pull | Baca hook aktual di FE → isi steps + copy popover |
| **Draft dulu** (opsional) | Belum ada hook | Output tabel flow saja (rencana); tandai selector masih usulan |
| **Buat tour datalist** | User minta create tour menu | Ikuti § Prompt template — Datalist tour |

## Prompt pendek

```
tour: {Menu Name}
```

atau setelah pull:

```
isi tour: {Menu Name}
```

atau buat tour datalist:

```
Create tour untuk Datalist dengan Breadcrumb {NAMA_MENU}, untuk menu {nama menu}.
```

---

## Prompt template — Datalist tour (WAJIB diikuti)

Gunakan prompt berikut (verbatim) sebagai aturan saat membuat tour guide datalist untuk menu:

```
Create tour untuk Datalist dengan Breadcrumb {NAMA_MENU}, untuk menu system product. cek apakah terdapat element select atau datepicker, jika ada maka jangan letakkan tour dengan side bottom, pastikan apakah menggunakan komponen dari vue form atau menggunakan dri prime. 

jika isi report berupa datalist maka buat tournya menyertakan dengan table head data tablenya nya, sertakan global search dengan advanced filter jika ada dan column show hide, import dan export jika ada .

jika ada button pentingnya ntah itu create atau calculate pokonya sejenis itu ada button, maka buat step tournya setelah step datatable.
Button Apply tidak perlu diberi tour
```

Ganti `{NAMA_MENU}` / nama menu sesuai permintaan user.

### Checklist implementasi (ringkas dari prompt di atas)

1. **Breadcrumb / welcome** — step pembuka memakai nama menu sesuai breadcrumb (`{NAMA_MENU}`).
2. **Select / DatePicker**
   - Cek apakah ada di halaman datalist.
   - Jika ada → **jangan** pakai `side: 'bottom'` untuk step itu.
   - Catat library: **Vueform** (`@vueform/multiselect`, dll.) atau **PrimeVue**.
   - Prefer `side: 'left'` / `'right'` / `'top'` agar popover tidak tertutup dropdown/kalender.
3. **Datalist / report berbentuk tabel** — sertakan step:
   - Global search (`.dt-search-all`) jika ada
   - Advanced filter / Filter Lanjutan (`.dt-btn-search-builder`) jika ada
   - Column show/hide (`.dt-btn-colvis-div`) jika ada
   - Import (mis. `.dt-btn-import-history-div` / `.dt-btn-import-div`) jika ada
   - Export (`.tour-export`) jika ada
   - **Table head** (`.dataTable thead`)
4. **Tombol penting** (Create, Calculate, Manual Calculate, sejenisnya)
   - Buat step tour-nya **setelah** step header datatable.
   - Tambah class hook `tour-*` di tombol jika belum ada.
5. **Jangan** buat step untuk tombol **Apply**.
6. **Copy** — semi-formal; description boleh bahasa Indonesia, tapi **title wajib sama dengan nama fitur di UI** (jangan diterjemahkan/diganti).
   - Contoh benar: `Advanced Filter`, `Columns Show/Hide`, `Show deleted data`, `Export`, `Create`, `Import`, `Global Search`, `Show virtual WH`
   - Contoh salah: `Filter Lanjutan`, `Atur Kolom`, `Data yang Dihapus`, `Pencarian Global`
7. **Judul welcome** — nama menu sesuai breadcrumb.
8. **Welcome = intro + poin kemampuan** — step pertama wajib:
   - 1 kalimat: menu ini apa
   - 2–4 bullet singkat: apa yang bisa dilakukan di halaman itu
   - Pakai `makeWelcomeDescription(intro, bullets)` (HTML list)
   - Target: user paham sekali baca, tanpa mengulang
9. **Satu step = satu esensi** — description hanya menjelaskan elemen yang sedang di-highlight. Jangan mencampur instruksi step lain, meta-tour ("klik Next", "tour lanjut otomatis"), atau daftar field berikutnya.
   - Contoh benar (Product): `Pilih produk yang riwayat stoknya ingin ditampilkan.`
   - Contoh salah: `Pilih Product … Setelah memilih, atur Building dan Period, lalu klik Apply — tour akan lanjut otomatis…`
10. **Jangan disable tombol Next** — `makeInteractiveSelectStep` boleh auto-advance saat seleksi valid, tapi Next harus tetap bisa diklik.
11. **Helper datalist** — untuk master/datalist standar, prefer `makeSimpleDatalistTour({...})` agar pola step konsisten.
    - Urutan toolbar mengikuti tampilan **kiri → kanan** (UI memakai `flex-row-reverse`): Show archived → Show deleted → Columns → Download Template → Export → Import → Log Data → Table Header → Create.

### Lokasi file FE tipikal

| Item | Path |
|------|------|
| Config tour | `olshoperp-frontend/src/config/tours/{modul}/{menu}.ts` |
| Registry helper | `olshoperp-frontend/src/config/tours/index.ts` |
| Import registrasi | `.../DataList.vue` → `import '@/config/tours/...'` |
| Route name | cocokkan `registerTour('route_name', steps)` dengan `router` |
| Trigger UI | TopBar ikon `?` via `hasTourForRoute` |

### Referensi tour yang sudah ada

- Purchase Order — `src/config/tours/scm/purchase-order.ts` (+ catatan teks: `olshoperp-docs/_local/tours/purchase-order-tour.md`)
- System Product — `src/config/tours/scm/system-product.ts`
- Real Time Stock, Product Mutation, Product Transaction History, Inventory Detail, Stock Monitoring — folder `scm/`

---

## Output wajib (format tetap)

```
# Tour — {Menu Name}
Route: /{path}
Sumber hook: {path file FE atau "draft — hook belum ada"}

## Flow (urutan step)

| # | Elemen UI | Selector / data-tour | Aksi tour | Popover (judul + isi singkat) | Catatan |
|---|-----------|----------------------|-----------|-------------------------------|---------|
| 1 | … | … | highlight | … | … |
```

Kolom **Aksi tour**:

| Aksi | Arti |
|------|------|
| `highlight` | Spotlight + popover; user tidak wajib klik |
| `highlight + explain-click` | Spotlight; jelaskan user nanti klik (tour tidak auto-klik) |
| `pre-click → highlight` | Klik dulu agar UI terbuka, lalu highlight |
| `wait-visible → highlight` | Tunggu elemen muncul, baru highlight |

## Cara riset (urutan — sesuaikan fase)

### Setelah pull FE (fase isi — prioritas)

1. Cari `data-tour` / config tour di `olshoperp-frontend` untuk menu tersebut
2. Cocokkan dengan elemen nyata di halaman
3. Isi popover dari requirement/KB (fungsi fitur) + label UI aktual
4. Jangan usulkan hook baru kecuali gap jelas — laporkan ke user

### Buat tour datalist (implementasi)

1. Baca `DataList.vue` + komponen datalist terkait
2. Audit: select/datepicker (vueform vs prime), search, filter, colvis, import, export, tombol penting
3. Buat/isi `src/config/tours/...`, register route name, import di halaman, class `tour-*` bila perlu
4. Urutan: welcome → toolbar/filter → import/export → **table head** → **tombol penting** → selesai

### Draft / belum ada hook

1. `olshoperp-docs/tests/pom-registry/{menu}.yaml`
2. `olshoperp-docs/tests/helpers/{menu}.ts`
3. FE pages untuk label/placeholder
4. Output tabel dengan selector **usulan**; label eksplisit: draft

## Aturan desain

- Basic = happy path (5–10 step); mulai setelah user sudah di halaman menu
- Urutan = alur pakai nyata (filter → data → aksi sekunder)
- Conditional UI → `wait-visible → highlight` + catat prasyarat
- Read-only menu → jangan highlight Create
- Tab sekunder = section "Opsional — Tab X"
- Setelah pull: **pakai selector yang sudah di FE**, jangan ganti sembarangan
- Select/datepicker → hindari `side: 'bottom'`
- Tombol penting → setelah step datatable head
- Tombol Apply → **tanpa** tour
- **Title step = nama fitur UI verbatim** (jangan terjemahkan: Advanced Filter, Columns Show/Hide, dll.)

## Referensi contoh

[examples.md](examples.md) — Real Time Stock (draft flow + usulan `data-tour`)
