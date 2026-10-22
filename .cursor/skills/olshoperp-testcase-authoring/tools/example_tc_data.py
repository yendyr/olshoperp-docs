# Contoh file data untuk tc_lib.py. Salin, ganti isi, lalu:
#   python3 tools/tc_lib.py contoh.py create   -> buat card Jira + link ke origin (jeda 2,5 dtk)
#   python3 tools/tc_lib.py contoh.py update   -> perbarui description card yang sudah ada
CFG = dict(
    origin="ETM-00000", request_id="recXXXXXXXXXXXXXX",      # salin Request ID card origin
    menu_label="Nama Menu",                                    # nama menu persis di aplikasi (juga field Notion Page)
    company_label="Dev Staging (kode DEV-STG)",
    list_url="https://staging.olshoperp.com/modul/menu",
    pre_common=["Akun uji QA yang punya akses menu ...", "Company aktif harus ... (cara cek ...)"],
    cleanup=[
        "Tandai SEMUA data uji buatan dengan nomor card ini (mis. 'QA ETM-xxxxx' di Description/Name). Prefiks QA-AUTO- bila memungkinkan.",
        "Kalau uji tanpa card Jira: tulis jejak skenario di data (mis. 'QA-AUTO skenario: …, tanggal').",
        "JANGAN hapus data uji setelah selesai (kecuali Expected memang menguji hapus). Cantumkan kode data + URL edit di Actual Result.",
    ],
    card_flow="Urutan status card: Testing Progress → Actual Result → Test Result → Done.",
)
KEYS = {}   # diisi otomatis (file *_keys.json) setelah create
TCS = [dict(
    n=1, ttype="happy", priority="High",   # ttype: happy|negative|edge|permission|regression|cross-menu
    title="Judul singkat skenario (happy)",
    summary="Ringkasan skenario dan tujuan.",
    req="requirement.md §x (aturan yang dirujuk)", menu_hint="Menu → Submenu → bagian layar",
    pre=["Kondisi data khusus TC ini."],
    data_tables=[("Data uji", ["Item", "Nilai", "Keterangan / link"], [["Customer", "PT Contoh (kode X)", ""]])],
    steps=[("Langkah 1.", []), ("Langkah 2.", ["Cek: hasil yang harus terlihat dengan angka eksak."])],
    expected=["Hasil yang diharapkan dengan angka eksak."], notes=["Catatan untuk penguji."],
)]
