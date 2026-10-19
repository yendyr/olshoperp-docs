# Akun Uji Khusus (per role/izin)

Akun untuk kasus uji yang butuh **role atau izin tertentu**. Akun default E2E (company FAT, `playwright@gmail.com`) tetap dijelaskan di rule `13-test-case-format.mdc` §4 dan **tidak** diulang di sini.

> [!CAUTION]
> Folder `qa-docs/` (termasuk file TC) dimirror ke repo developer dan dipakai Help Center. Karena itu **kata sandi hanya boleh ditulis di file ini** (`tests/` tidak dimirror). File TC cukup menyebut email akun dan menunjuk ke file ini.

## Daftar akun

| Akun | Kata sandi | Role / izin | Environment | Dipakai untuk | Terakhir diverifikasi |
|---|---|---|---|---|---|
| `withoutvoid@olshoperp.com` | `12345678` | Bisa melihat Sales Order, tetapi **tidak punya izin Void dan Approve** | **staging dan tyas saja** | Kasus permission terkait Void/Approve, mis. `TC-SPLG-061` (ETM-16431) | 19-10-2026 di staging: login berhasil, company awal Lumi Charms.id (153), bisa pindah ke FAT (112) |

## Aturan pakai
1. **Hanya staging dan tyas.** Jangan dipakai di Merdian/production. Test di tyas hanya atas permintaan eksplisit dan sebisa mungkin baca saja.
2. Dipakai khusus untuk kasus yang menguji **ketiadaan izin Void/Approve** (tombol/ikon tersembunyi, aksi ditolak). Untuk kasus lain pakai akun default E2E.
3. Selalu bandingkan dengan akun yang punya izin pada data yang sama agar jelas bahwa perbedaannya karena izin, bukan data.
4. Cek **semua titik masuk** aksi (kolom Action datalist dan toolbar halaman edit), bukan satu saja. Ikon toolbar tidak punya teks; periksa DOM (`svg[data-icon]`) atau hover untuk tooltip.
5. Jangan mengubah data (Void/Closed/Unapprove) kecuali kasusnya memang menguji aksi itu.

## Catatan akun
- Dibuat/disediakan oleh Yemima, diberikan di sesi 19-10-2026 untuk ETM-16431.
- Di database staging akun ini ada (id 81, status aktif).
- Di tyas belum pernah diverifikasi oleh Bugsy; keberadaan akun di sana berdasarkan keterangan Yemima.
- Temuan yang ditemukan dengan akun ini: tombol **Unapprove** tetap tampil di halaman edit SO Approved walau user tanpa izin approve (lihat `TC-SPLG-061`).
