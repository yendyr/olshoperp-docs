---
doc_type: knowledge-base
menu: accounting-settlement-mapping
menu_name: "Settlement Mapping"
version: 2.0
last_updated: 2026-10-09
owner: QA - Yemima
status: review
audience: operator
aliases: [settlement mapping, mapping settlement, map kolom settlement, fee marketplace mapping]
---

# Settlement Mapping — Knowledge Base (Operator)

**Audience:** Finance, ops settlement, support  
**Menu:** Accounting → Settlement Mapping  
**Route:** `/accounting/settlement-mapping`

---

## 1. Apa itu Settlement Mapping?

Menu untuk **menghubungkan judul kolom** di file settlement marketplace (Shopee / TikTok / Lazada) ke:

- **Internal Label** — nama biaya/diskon versi perusahaan  
- **COA** — akun akuntansi  
- **Value Type** — **Plus** atau **Minus** (cara baca angka di Excel)

Saat upload di **Instant Settlement**, sistem memakai mapping milik **company data owner** store. Hasilnya jadi baris biaya tambahan atau diskon di **Sales Invoice**.

Tanpa mapping yang cocok, nilai **produk** tetap bisa diproses; **fee kolom** marketplace tidak masuk invoice.

---

## 2. Kapan setup?

| ✅ Setup mapping jika | ❌ Tidak perlu di sini jika |
|----------------------|-----------------------------|
| Mau upload settlement Shopee / TikTok / Lazada | File **General** / Other — pakai pola Other Cost/Discount (`OC:` / `OD:`) |
| Ada kolom fee baru di export marketplace | Hanya mau ubah Sales Invoice lama (mapping tidak mengubah SI lama) |
| Ganti company / data owner store | — |

**Urutan:** isi Settlement Mapping **dulu**, baru upload Instant Settlement.

---

## 3. Cara pakai (ringkas)

1. Buka accordion **Shopee**, **TikTok**, atau **Lazada**.
2. Isi Internal Label, pilih COA, ketik **Source Column** = judul kolom di Excel **persis** (spasi & huruf besar/kecil harus sama).
3. Pilih Value Type **Plus** atau **Minus**.
4. Klik tombol tambah. Atau ubah langsung di baris tabel (inline).
5. Opsional: **Import** dari template Excel / **Export** untuk backup.
6. Hapus baris yang tidak dipakai (hilang dari daftar; SI lama tetap).

🎬 [Interactive demo akan ditambahkan di sini]

---

## 4. Plus vs Minus — contoh angka

| Value Type | Angka di Excel | Masuk SI sebagai |
|------------|----------------|------------------|
| Plus | 5.000 | Biaya (Other Cost) 5.000 |
| Plus | −3.000 | Diskon (Other Discount) 3.000 |
| Minus | 8.000 | Diskon 8.000 |
| Minus | −2.000 | Biaya 2.000 |

Angka **0** di kolom termapping **diabaikan** (tidak buat baris biaya/diskon).

**Internal Label** boleh sama antar baris / antar platform. **Source Column** tidak boleh dobel di platform yang sama (dalam company Anda).

---

## 5. Siapa yang memakai mapping saat upload?

Instant Settlement memakai mapping milik **Data Owner** store yang dipilih — bukan sembarang company. Mapping Anda **private**: company lain tidak memakai daftar Anda.

---

## 6. Troubleshooting

| Gejala | Cek dulu |
|--------|----------|
| Fee di Excel tidak muncul di SI | Judul kolom **exact** sama dengan Source Column? Platform accordion benar? Amount bukan 0? |
| Selisih besar Difference Settlement–SI | Mapping kurang / salah Value Type / COA |
| Tidak bisa tambah baris (duplikat) | Source Column sudah ada di platform yang sama |
| Import gagal di beberapa baris | Buka import log — sering Value Type bukan plus/minus, platform salah, atau COA tidak memenuhi syarat import |
| Ubah mapping tapi SI lama sama | Normal — hanya upload **berikutnya** yang terpengaruh |
| Baris hilang setelah hapus | Soft delete — tidak dipakai lagi di Instant Settlement |

---

## 7. FAQ

**Q: Kenapa fee tidak masuk SI?**  
A: Salin judul kolom dari Excel ke Source Column tanpa ubah huruf besar/kecil. Pastikan company data owner store = pemilik mapping, dan angka kolom bukan 0.

**Q: Boleh label sama berkali-kali?**  
A: Ya. Yang tidak boleh dobel: Source Column di platform yang sama.

**Q: Platform Other di mana?**  
A: Bukan di accordion Settlement Mapping. Instant Settlement tipe General memakai Other Cost / Other Discount dengan prefix kolom khusus.

**Q: Company cabang bisa pakai mapping HQ?**  
A: Tidak — tiap company punya mapping sendiri (private).

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Technical | [technical.md](./technical.md) |
| User Guide | [user-guide.md](./user-guide.md) |
| Instant Settlement | [../accounting-settlement-upload/knowledge-base.md](../accounting-settlement-upload/knowledge-base.md) |
