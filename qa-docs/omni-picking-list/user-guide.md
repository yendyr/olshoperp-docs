---
doc_type: user-guide
menu: omni-picking-list
menu_name: "Picking List"
version: 1.0
last_updated: 2026-09-29
owner: QA - Yemima
status: review
audience: end-user
---

# Picking List — User Guide

Cara memakai menu **Picking List** di Supply Chain › Processing.

**Alamat:** `/omni/picking-list`

> Catatan: tampilan process sedang di-improve ([ETM-16131](https://erpintegration.atlassian.net/browse/ETM-16131)). Langkah di bawah mengikuti perilaku saat ini.

---

## 1. Buka daftar Picking List

1. Login OlshopERP.  
2. Menu **Supply Chain › Processing › Picking List**.  
3. Gunakan pencarian / Advanced Filter bila perlu.  
4. Optional: aktifkan pill **Incomplete SO Picklist** untuk fokus order yang belum selesai pick-nya.

---

## 2. Baca status di tabel

| Kolom | Artinya |
|-------|---------|
| Picking Status `-` | Belum mulai pick (Draft) |
| In Progress | Sudah Start Picking |
| Paused | Pick dijeda |
| Complete | Sudah selesai (Approved) |
| Time Duration | Saat jalan: berapa picked vs unpicked; setelah selesai: lama pick |

---

## 3. Kerjakan picking

1. Klik Action pada baris PL → buka halaman process.  
2. Klik **Start Picking**.  
3. Centang / pick baris produk; unpick jika salah.  
4. Sesuaikan **Location** hanya untuk baris yang belum picked (pilih lokasi di struktur gudang yang sama).  
5. Jika semua siap, **Complete**.  
6. Jika masih ada yang belum di-pick, ikuti **Review Unpicked**, lalu lanjut sampai Yay / Completion Summary.

---

## 4. Tips

- Satu PL bisa berisi beberapa Sales Order; satu Sales Order bisa ada di beberapa PL (beda warehouse process).  
- Pill Incomplete SO = tentang **order**, bukan “apakah PL ini Complete”.  
- Jangan pakai menu ini untuk **buat** PL manual — gunakan **Manual Picking List**.

---

## 5. Masalah umum

| Masalah | Coba |
|---------|------|
| PL tidak ketemu | Longgarkan filter; cek Show deleted; pastikan sudah digenerate dari Wave |
| Lokasi tidak bisa diubah | Baris sudah picked — unpick dulu (jika diizinkan) |
| Complete tidak jalan | Selesaikan unpicked lewat Review Unpicked |
