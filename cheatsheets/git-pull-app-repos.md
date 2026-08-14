# Pull repo aplikasi — `olshoperp` & `olshoperp-frontend`

Untuk ambil update terbaru dari remote. **Jangan** `git pull` polos di frontend.

| Repo | Folder | Branch lokal | Pull dari |
|------|--------|--------------|-----------|
| Backend | `olshoperp` | `dev` | `origin/dev` |
| Frontend | `olshoperp-frontend` | `driver-js_dev` | `origin/dev` |

Sesuaikan `$Root` sekali di mesin ini. Folder itu harus berisi kedua repo.

```powershell
# Windows — contoh
$Root = "D:\olshoperp"
```

```bash
# macOS — contoh
Root="$HOME/Documents/GitHub"
```

---

## Copy-paste — pull keduanya

### PowerShell

```powershell
$Root = "D:\olshoperp"

cd "$Root\olshoperp"
git checkout dev
git pull --rebase --autostash origin dev

cd "$Root\olshoperp-frontend"
git checkout driver-js_dev
git pull --rebase --autostash origin dev
```

### Bash / zsh

```bash
Root="$HOME/Documents/GitHub"

cd "$Root/olshoperp"
git checkout dev
git pull --rebase --autostash origin dev

cd "$Root/olshoperp-frontend"
git checkout driver-js_dev
git pull --rebase --autostash origin dev
```

`--autostash` menyimpan kerjaan lokal sementara, pull, lalu kembalikan. Kalau muncul conflict: perbaiki file → `git add <file>` → `git rebase --continue`. Batalkan: `git rebase --abort`.

---

## Satu repo saja

### Backend — `olshoperp`

```powershell
cd D:\olshoperp\olshoperp
git checkout dev
git status -sb
git pull --rebase --autostash origin dev
```

### Frontend — `olshoperp-frontend`

```powershell
cd D:\olshoperp\olshoperp-frontend
git checkout driver-js_dev
git status -sb
git pull --rebase --autostash origin dev
```

Frontend **harus** `git pull --rebase --autostash origin dev`. `git pull` tanpa `origin dev` sering gagal karena branch lokal tidak tracking `dev`.

---

## Cek dulu kalau ragu

```powershell
git status -sb
git stash list
```

| Gejala | Artinya | Tindakan |
|--------|---------|----------|
| `behind` / file baru dari remote | Perlu pull | Jalankan perintah di atas |
| `no tracking information` | Rebase belum ke `dev` | `git pull --rebase --autostash origin dev` |
| Conflict saat rebase | Editmu bentrok dengan `dev` | Fix → `git add` → `git rebase --continue` |
| Masih di branch kartu (`ETM-…`) | Bukan branch kerja QA | `git checkout` dulu ke `dev` / `driver-js_dev` |

---

## Jangan

- `git pull` polos di `olshoperp-frontend`
- `git push` ke `main` atau `dev` dari frontend (push FE hanya ke `driver-js_dev`)
- `git pull --force` / `git reset --hard` kecuali kamu yakin kerjaan lokal boleh hilang
- Pull `olshoperp-docs` dengan perintah ini — docs pakai `main`, lihat `_local/qa-cheatsheet.md`
