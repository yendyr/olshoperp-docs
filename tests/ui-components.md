# Katalog Komponen UI OlshopERP — Kontrak Interaksi Playwright

Kamus **level komponen** (bukan level field). `pom-registry/*.yaml` menjawab
"field X di menu Y selectornya apa"; dokumen ini menjawab **"komponen ini perilakunya
bagaimana, dan cara benar berinteraksi dengannya seperti apa"**.

> [!IMPORTANT]
> **Wajib dibaca sebelum menulis interaksi UI baru** (rule 14 §8A urutan lookup).
> Semua jebakan di bawah pernah menyebabkan test FAIL/flaky nyata dan sudah ditangani
> di helper. **Jangan tulis interaksi komponen dari nol** — panggil helper `shared/`.
> Kalau komponen baru belum ada di sini: tambahkan helper di `tests/helpers/shared/`
> **dan** entri di dokumen ini, jangan copy-paste selector ke helper menu.

> [!NOTE]
> **Sinkron dengan source.** Tiap komponen di bawah di-anchor ke file source di
> `olshoperp-frontend` + versi library-nya lewat `tests/component-anchors.json`.
> Jalankan `npm run component:sync` untuk mendeteksi kalau frontend berubah dan
> katalog ini jadi stale. Repo app **hanya dibaca** (rule `15`).

---

## 1. Multiselect — `@vueform/multiselect`

Dropdown utama seluruh ERP (Supplier, Payment Type, Warehouse, Unit, Store, COA…).

| Aspek | Nilai |
|---|---|
| Identifikasi DOM | `.multiselect` (root), input search `[aria-placeholder="Choose {Field}"]`, opsi `.multiselect-option` |
| Helper | `tests/helpers/shared/multiselect.ts` → `OlshopMultiselect` |
| Method utama | `ensureValue(combobox, label)` — idempotent: skip kalau nilai sudah benar |

**Jebakan (semua sudah ditangani helper):**

1. **Ketikan pertama ditelan re-render.** `fill()` tepat setelah dropdown dibuka bisa menghasilkan input kosong → 0 opsi. Helper: retry 3× dengan verifikasi `toHaveValue`, percobaan ke-2+ pakai `pressSequentially` (real key events) karena `fill()` (input event sintetis) bisa dioverride v-model.
2. **Dropdown menutup sendiri** saat re-render → ketikan/klik jatuh ke void (gejala: `locator.click timeout` pada opsi yang jelas-jelas ada). Helper: guard re-open sebelum mengetik **dan** sebelum klik opsi.
3. **Search butuh string yang cocok dari awal token.** `"Supplier IDR"` → 0 hasil; `"PT. Supplier IDR"` → 2 hasil. Selalu pakai label lengkap.
4. **`textContent` root membawa teks SELURUH opsi** saat dropdown masih terbuka — assert label terpilih jadi false negative (`"PT. Supplier IDRPT. Supplier IDR & Foreign…"`). Helper: tutup dropdown (Escape + klik luar) di dalam loop `toPass` sebelum membaca label.
5. **`aria-expanded` tidak selalu ada** — deteksi "masih terbuka" lebih andal via `visibleOptions().count() > 0`.

```ts
// BENAR
await this.multiselect.ensureValue(this.supplierCombobox, 'PT. SUPPLIER IDR');
// SALAH — akan flaky
await combobox.click(); await combobox.fill('PT. SUPPLIER IDR'); await page.getByText('PT. SUPPLIER IDR').click();
```

---

## 2. Modal / Dialog — Headless UI

Dipakai untuk modal Available Products, Available Purchase Order, Create Inbound Product,
Approval, konfirmasi delete.

| Aspek | Nilai |
|---|---|
| Identifikasi DOM | `[role="dialog"]` di dalam `#headlessui-portal-root`; panel `div.fixed.rounded` |
| Helper | belum ada helper generik — pola di `purchase-inbound.ts` / `purchase-order.ts` |

**Jebakan:**

1. **Wrapper `[role=dialog]` dinilai *hidden* oleh Playwright** (zero-size wrapper), sehingga `getByRole('dialog').waitFor({state:'visible'})` **selalu timeout** walau dialog terlihat di layar. **Solusi: deteksi via elemen di dalamnya** (heading), lalu scope aksi ke wrapper:

```ts
const dialog = page.locator('[role="dialog"]')
  .filter({ has: page.getByRole('heading', { name: /create inbound product/i }) }).last();
const heading = dialog.getByRole('heading', { name: /create inbound product/i }).first();
await heading.waitFor({ state: 'visible', timeout: 15_000 });   // tunggu heading, bukan wrapper
// … aksi di dalam dialog …
await expect(heading).toBeHidden({ timeout: 20_000 });          // tutup = heading hilang
```

2. **Portal meng-intercept pointer** — elemen di belakang modal (mis. search box DataTables) melaporkan "element is visible, enabled and stable" tapi klik ditolak: `<div id="headlessui-portal-root"> subtree intercepts pointer events`. Artinya ada dialog terbuka yang belum ditutup — **selesaikan dialognya dulu**, jangan `force: true`.
3. **Modal bertumpuk** (modal outstanding → dialog detail): selalu pakai `.last()` untuk menargetkan yang paling atas.

---

## 3. Input Numeric-Mask (qty, harga)

| Aspek | Nilai |
|---|---|
| Identifikasi DOM | `input[type=text]` dengan `lang="nl"` + atribut `data-old-value` |
| Contoh | Request Qty PR, PO Qty, Inbound Qty, Max Inbound Qty |

**Jebakan:** `fill()` **menggabungkan** nilai lama dengan yang baru — isi `1`, fill `25` → nilai jadi `251`. Wajib select-all dulu + verifikasi + retry:

```ts
for (let attempt = 0; attempt < 3; attempt++) {
  await qtyInput.click({ clickCount: 3 });          // select all
  await qtyInput.fill(String(qty)).catch(async () => {
    await qtyInput.pressSequentially(String(qty), { delay: 30 });
  });
  await qtyInput.blur();
  if (await expect(qtyInput).toHaveValue(String(qty), { timeout: 2_000 }).then(() => true).catch(() => false)) break;
}
```

Sudah diterapkan di `purchase-requisition.ts#fillRequestQtyForSku`. Ikuti pola yang sama untuk input qty menu lain.

---

## 4. Date Picker — `VueDatePicker` (custom, bukan vuepic/PrimeVue murni)

| Aspek | Nilai |
|---|---|
| Identifikasi DOM | `input.olshoperp-datepicker-input`; panel `.olshoperp-datepicker-panel` |
| Source | `olshoperp-frontend/src/base-components/project/VueDatePicker/VueDatePicker.vue` |
| Format | model `yyyy-MM-dd HH:mm:ss` · display `dd-MM-yyyy HH:mm:ss` |

**Jebakan:**
1. Sebagian menu lama memakai wrapper berbeda (`input.p-datepicker-input`) — locator helper memakai `.or()` untuk keduanya (lihat `purchase-inbound.ts#transactionDateInput`).
2. **Transaction Date auto-fill datang async** — jangan baca sekali jalan, poll dengan `expect(...).toPass()`.
3. Tanggal hari ini sering ditolak **fiscal period**. Pola fallback: tangkap error → set tanggal ke periode terbuka → ulang (lihat `setTransactionDateFiscalFallback`).

---

## 5. DataList / DataTables (tabel datalist tiap menu)

| Aspek | Nilai |
|---|---|
| Identifikasi DOM | `input.dt-input[placeholder=" find something ..."]`, `Showing X to Y of Z entries` |
| Helper | `tests/helpers/shared/datalist.ts` |
| Loading state | Teks **`Loading...`** + spinner muncul di area tabel setiap refetch |

**Jebakan:**
1. Kolom status/TYPE sering **ter-truncate** (`Payment from Custome...`) — assert pakai **prefix/regex**, jangan string penuh.
2. Search box bisa ter-intercept portal modal (lihat §2.2).
3. Page length default kecil — set page size sebelum mencari baris di daftar panjang (`setPageLength`).
4. **Refetch async → race baca baris.** Setiap `search()`, toggle filter (mis. *Show deleted data*), atau ganti page length memicu **AJAX refetch**; tabel menampilkan `Loading...` dulu. Membaca baris sebelum spinner hilang = snapshot mid-load, baris seakan tidak ada. **Selalu `await datalist.waitForIdle()`** (menunggu `Loading...` detach) setelah aksi yang mengubah isi tabel. `search()` sudah memanggilnya otomatis; toggle/checkbox manual harus dipanggil sendiri.
5. **`isVisible()` ≠ `toBeVisible()`.** `locator.isVisible({timeout})` **tidak** auto-retry — ia snapshot state saat itu juga (opsi `timeout` menyesatkan). Untuk memastikan baris hadir setelah refetch, pakai `await expect(row).toBeVisible({ timeout })` (polling) — bukan `isVisible()`. Gunakan `isVisible()` hanya untuk cek "ada/tidak" yang memang sudah pasti settle.

---

## 6. Tabel Detail (baris produk di dalam form)

| Aspek | Nilai |
|---|---|
| Helper | `tests/helpers/shared/detail-table.ts` |

**Jebakan:** SKU dengan tanda hubung/spasi bervariasi antar menu — pakai `skuPattern()` (tokenisasi `[\s-]+`) alih-alih string literal.

---

## 7. Radio Status Transaksi (Draft / Open)

| Aspek | Nilai |
|---|---|
| Identifikasi DOM | `input[type=radio]#draft`, `#open` |

**Jebakan:**
1. **Radio bisa *detach* dari DOM saat form re-render** (`Element is not attached to the DOM`) — bungkus `check()` dalam `expect(...).toPass()`.
2. Setelah memilih status, FE menembak API — **tunggu response** sebelum aksi berikutnya (rule 14 §8B).
3. Radio `disabled` selama `!is_edit` di sebagian form — pastikan sudah di halaman edit.

---

## 8. Toast

| Aspek | Nilai |
|---|---|
| Identifikasi DOM | `.toastify, [class*="toast"]` |
| Helper | `tests/helpers/shared/toast.ts`, `scenarios/support.ts#assertNoBlocker` |

**Jebakan:** toast sukses & error memakai kelas yang sama — filter berdasarkan teks. Toast "fiscal period" sering muncul sebagai peringatan non-blocking; `assertNoBlocker` sengaja mengecualikannya.

---

## 9. Tombol aksi form (Save All / Save & Next / Approve)

**Jebakan — perubahan UX ≥2026-08 (Purchase Order):** tombol **Save & Next sudah tidak ada**.
Klik `Create` kini **auto-membuat draft di server** dan langsung redirect ke `/edit/{id}`;
kode transaksi dibaca dari field Transaction Code di halaman. Konsekuensi operasional:
**tiap klik Create meninggalkan draft orphan** kalau tidak diselesaikan — bersihkan berkala
(`purchase-order.ts#deleteDraftPlaywrightPos`).

Cek dulu apakah menu yang sedang dikerjakan sudah ikut pola auto-draft ini sebelum
mencari tombol Save & Next.

---

## 10. Modal Outstanding (Available Products / Available Purchase Order)

**Jebakan — Purchase Inbound (UX ≥2026-08):**
1. Tombol **bulk Use disabled** meskipun baris sudah ter-ceklis → pakai tombol **Use per-baris**.
2. Use per-baris membuka dialog **Create Inbound Product** (lihat §2).
3. Di dialog, mengisi *Max Inbound Qty* saja **tidak cukup** — wajib klik **"Allocate Full Qty (Clearing)"** untuk mengisi alokasi quantity, kalau tidak Save ditolak backend `422 The quantity field is required`.

Purchase Order masih memakai bulk Use (`clickBulkUseAboveOutstandingTable`) — **jangan asumsikan
kedua menu berperilaku sama**.

---

## Aturan umum interaksi (berlaku semua komponen)

| Aturan | Alasan |
|---|---|
| `locator.isVisible()` **tidak menunggu** — parameter timeout diabaikan | Pakai `waitFor()` / `expect().toBeVisible()`; ini pernah bikin dialog dianggap tidak muncul |
| Dilarang `page.waitForTimeout` statis di kode baru | Sumber flaky nomor satu di chain panjang; pakai wait-for-condition |
| Nilai yang diisi FE secara async **wajib di-poll** | `expect(...).toPass()` / `toHaveValue()` — jangan baca sekali jalan |
| Judul `describe`/`test` **wajib statis** | Judul dinamis → "Test not found in the worker process" |
| Selector baru **wajib dari source Vue**, bukan DOM scraping | Fondasi stabilitas; lihat rule 14 § kontrak tooling |

---

## Addendum — flaky yang sudah ditangani di `shared/multiselect.ts#open()`

`scrollIntoViewIfNeeded` / `click` pada combobox bisa gagal dengan
`Element is not attached to the DOM` atau "element is not stable" ketika form
sedang re-render (mis. saat supplier & payment type auto-fill berbarengan).
Helper `open()` kini membungkus **seluruh urutan** (scroll → klik → verifikasi
`aria-expanded`) dalam `expect(...).toPass()`, bukan hanya klik-nya. Terapkan pola
yang sama untuk komponen lain yang node-nya bisa diganti saat re-render.

---

## Addendum — jebakan yang ditemukan saat membangun flow AP (Pilot 2)

**Warehouse destination wajib sebelum APPROVE inbound.** Backend menolak dengan
`The selected destination warehouse must be level of 20 or below and smallest warehouse`
kalau destination default bukan warehouse terkecil (level ≤20). Tidak terlihat saat
inbound hanya disimpan Open — baru muncul di flow yang meng-approve. Ditangani
`purchase-inbound.ts#setLocationDestination`; nilainya datang dari fixture
(`warehouse_destination`), jangan hardcode.

**Helper jangan hardcode nilai test data.** `account-payment.ts#selectSupplier` dulu
memilih opsi dropdown dengan pola `/Unbilled Goods/i` — nama supplier dari TC yang
pertama kali memakainya — sehingga gagal untuk supplier lain padahal parameternya
sudah benar. Helper harus memilih berdasarkan argumen yang diterima. Kalau menulis
helper baru: pastikan tidak ada literal nama supplier/SKU/bank di dalamnya.

**Kode dokumen yang di-generate server selalu perlu wait.** Pola `IN-*`, `PR-*`,
`PO-*` diisi async setelah header tersimpan. Baca dengan
`expect(input).toHaveValue(/^XX-/)` dulu, jangan `inputValue()` sekali jalan —
gejalanya flaky "Transaction code XX-* tidak ditemukan di halaman".

**Method helper bisa sudah mencakup langkah sebelumnya.** `ensureEditWithSupplier()`
di Supplier Invoice sudah memanggil `openCreateForm()` + `selectSupplier()` +
`fillDescription()` + simpan header. Memanggil `openCreateForm()` lagi sebelum itu
membuat **dokumen kedua** dan meninggalkan draft orphan. Baca implementasi helper
sebelum merangkainya di scenario.
