---
doc_type: knowledge-base
menu: ai-kb-assistant
menu_name: "AI Assistant"
version: 1.0
last_updated: 2026-06-20
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, how-to, troubleshooting]
---

# AI Assistant — Knowledge Base

## 1. Apa itu AI Assistant?

**AI Assistant** (OlshopERP Assistant) adalah chat bantuan dokumentasi di pojok kanan bawah aplikasi. Jawaban diambil dari dokumentasi QA/API yang sudah di-index ke Gemini File Search — bukan data operasional live (stok, PO, dll.).

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| FAB | Floating Action Button (ikon chat bulat) |
| Corpus | Kumpulan file markdown yang di-index |
| Vector store | Penyimpanan pencarian semantik di Gemini |
| Indexing | Proses upload/chunk dokumen ke vector store |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Bertanya tentang requirement menu, validasi, alur bisnis dari `docs/qa-docs/`
- Melihat riwayat percakapan dalam sesi (satu thread per user)
- Clear conversation dari panel chat

### Tidak Bisa
- Mengubah data ERP, approve transaksi, atau generate kode
- Menjawab dari data database real-time
- Streaming jawaban (respons tunggal per kirim)

## 4. Cara Pakai (How-To)

### Akses pertama kali
1. Admin buka **Developer Setting → Setting → Role → Role Privilege**
2. Centang **View** pada menu **AI Assistant** (grup Documentation Assistant) untuk role yang bersangkutan
3. User **logout lalu login ulang**
4. FAB chat muncul di atas theme picker (pojok kanan bawah)

### Mengirim pertanyaan
1. Klik ikon chat (FAB)
2. Ketik pertanyaan di kotak teks (full width)
3. Klik **Send** atau Enter
4. Tunggu jawaban assistant (rate limit: ~1 pesan/menit default)

### Indexing corpus (admin)
Indexing dilakukan dari menu [KB Store Monitor](../kb-store-monitor/knowledge-base.md), bukan dari FAB.

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| FAB tidak muncul | Role belum punya privilege **View** pada AI Assistant, atau belum re-login | Set Role Privilege → logout/login; cek `localStorage.auth.user.can_use_kb_assistant === true` |
| FAB overlap theme picker | Posisi UI lama | Deploy frontend terbaru (FAB di `bottom-18`, di atas theme bar) |
| 403 saat kirim pesan | Tidak punya akses `use` policy | Sama seperti FAB: privilege menu AI Assistant |
| 429 One message per minute | Rate limit aktif | Tunggu countdown di panel |
| Jawaban kosong / tidak relevan | Corpus belum ter-index atau pertanyaan di luar dokumen | Jalankan indexing di KB Store Monitor |
| 502 empty response | Model Gemini mengembalikan teks kosong | Coba ulang atau pertanyaan lebih spesifik |

## 6. FAQ

**Q: Apakah cukup centang KB Store Monitor saja?**  
A: Tidak. FAB chat membutuhkan privilege **AI Assistant** (parent menu). Monitor dan chat adalah dua menu terpisah.

**Q: Apakah master user otomatis bisa pakai chat?**  
A: Ya (`is_master_user = 1`).

**Q: Setelah ubah Role Privilege, perlu apa lagi?**  
A: Logout dan login ulang agar flag `can_use_kb_assistant` ter-update di browser.
