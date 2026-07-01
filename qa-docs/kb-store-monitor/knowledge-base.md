---
doc_type: knowledge-base
menu: kb-store-monitor
menu_name: "KB Store Monitor"
version: 1.0
last_updated: 2026-06-20
owner: QA - Yemima
status: draft
audience: operator
sections:
  core: [what-is, glossary, can-cannot, faq, help]
  modular: [data-source, how-to, troubleshooting]
---

# KB Store Monitor — Knowledge Base

## 1. Apa itu KB Store Monitor?

Halaman admin untuk memantau **vector store** dokumentasi OlshopERP di Gemini: store ID, status kesehatan, jumlah file corpus vs dokumen ter-index, dan tombol **Re-index corpus**.

## 2. Glosarium

| Istilah | Arti |
|---------|------|
| Store ID | ID Gemini File Search store (`fileSearchStores/...`) |
| Corpus files | File markdown di disk yang masuk scope indexing |
| Indexed documents | Chunk/dokumen yang sudah ada di vector store |
| Re-index | Queue job upload ulang chunk yang belum/baru |

## 3. Yang Bisa / Tidak Bisa Dilakukan

### Bisa
- Lihat snapshot store (status, corpus count, indexed count)
- Trigger indexing gap / re-index
- Refresh status

### Tidak Bisa
- Edit isi jawaban chat dari halaman ini
- Indexing sinkron dari UI (background queue; gunakan `php artisan ai:index-kb --sync` untuk CLI sync)

## 4. Cara Pakai (How-To)

### Setup awal (staging/production)

```bash
# Di server API
composer require laravel/ai:^0.8   # jika belum
php artisan migrate
php artisan db:seed --class="Modules\Gate\Database\Seeders\ModuleMenu\AIMenuSeeder"
php artisan db:seed --class="Modules\AI\Database\Seeders\AIDatabaseSeeder"
```

**.env backend (wajib):**

```env
GEMINI_API_KEY=your-key
AI_KB_PROVIDER=gemini
# opsional: AI_KB_QUEUE=olshoperp_staging  (default mengikuti REDIS_QUEUE)
```

```bash
php artisan config:clear
php artisan cache:clear
php artisan queue:restart
```

### Role Privilege
1. **Developer Setting → Role → Role Privilege**
2. Grup **Documentation Assistant**
3. **KB Store Monitor:** centang **View** (dan **Update** jika perlu trigger re-index)
4. **AI Assistant:** centang **View** jika role juga perlu FAB chat

### Indexing pertama
1. Buka menu **KB Store Monitor**
2. Klik **Re-index corpus** (atau **Start initial indexing** jika store belum ada)
3. Pastikan queue worker memproses queue **`REDIS_QUEUE`** (mis. `olshoperp_staging`)
4. Refresh sampai **Indexed documents** mendekati **Corpus files**

### CLI alternatif

```bash
php artisan ai:index-kb          # background (queue REDIS_QUEUE)
php artisan ai:index-kb --sync   # foreground, tanpa queue
```

## 5. Troubleshooting

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| Menu tidak muncul di sidebar | Menu belum di-seed atau privilege belum di-set | Jalankan `AIMenuSeeder`; set Role Privilege; re-login |
| `GEMINI_API_KEY` error saat index | Key tidak terbaca config | `php artisan config:clear`; pastikan `config('ai.providers.gemini.key')` tidak null |
| `Indexing already in progress` | Job nyangkut di queue salah (`default` / `ai`) | Clear queue lama; deploy patch; pastikan `REDIS_QUEUE` benar |
| Indexed documents = 0 lama | Worker tidak jalan / job gagal | Cek Horizon/logs; pastikan worker listen `default` |
| Store inaccessible | Store ID milik API key lama | Re-index (buat store baru untuk key saat ini) |
| Sidebar kosong setelah deploy AI | Cache permission menu | `php artisan cache:clear`; re-login |

## 6. FAQ

**Q: Berapa file corpus yang di-index?**  
A: Scope utama: `docs/qa-docs/**/*.md`, `docs/api/**/*.md`, `Modules/*/docs/**/*.md`, `AGENTS.md`, plus secondary `.cursor/rules` dan `docs/db-schema`. Exclude: `_legacy`, `_meta`, `draft.md`.

**Q: Perlu queue `ai` terpisah?**  
A: Tidak. Default mengikuti **`REDIS_QUEUE`** (`olshoperp_staging` / `olshoperp_production`). Override opsional via `AI_KB_QUEUE`.

**Q: Setelah ganti GEMINI_API_KEY?**  
A: Re-index corpus; store lama tidak accessible dengan key baru.
