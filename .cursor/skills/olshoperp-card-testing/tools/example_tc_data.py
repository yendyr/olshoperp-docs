# Contoh file data untuk tc_lib.py. Salin, ganti isi, lalu:
#   python3 tools/tc_lib.py contoh.py create   -> buat card Jira + link ke origin (jeda 2,5 dtk)
#   python3 tools/tc_lib.py contoh.py docs     -> tulis dokumen TC DRAFT + README folder menu
#   python3 tools/tc_lib.py contoh.py update   -> perbarui description card yang sudah ada
CFG = dict(
    origin="ETM-00000", request_id="recXXXXXXXXXXXXXX",      # salin Request ID card origin
    menu_label="Nama Menu", slug="menu-slug", prefix="PREF",  # slug = folder qa-docs, prefix = TC-PREF-DRAFT-...
    doc_prefix="", company_id=13, company_code="DEV-STG", company_label="Dev Staging (kode DEV-STG)",
    list_url="https://staging.olshoperp.com/modul/menu", day="20261022", ts0=90000, date="2026-10-22",
    related_menus=["menu-slug-lain"],
    pre_common=["Akun uji QA yang punya akses menu ...", "Company aktif harus ... (cara cek ...)"],
    cleanup=["Hapus data uji yang menahan fixture bersama setelah angka dicatat di komentar Jira."],
    card_flow="Urutan status card: Testing Progress → Actual Result → Test Result → Done.",
    old_tcs="ETM-... sampai ETM-...",
)
KEYS = {}   # diisi otomatis (file *_keys.json) setelah create
TCS = [dict(
    n=1, ttype="happy", priority="High",   # ttype: happy|negative|edge|permission|regression|cross-menu
    title="Judul singkat skenario (happy)",
    summary="Ringkasan skenario dan tujuan.", doc_summary="Ringkasan satu baris untuk dokumen.",
    req="requirement.md §x (aturan yang dirujuk)", menu_hint="Menu → Submenu → bagian layar",
    pre=["Kondisi data khusus TC ini."],
    data_tables=[("Data uji", ["Item", "Nilai", "Keterangan / link"], [["Customer", "PT Contoh (kode X)", ""]])],
    steps=[("Langkah 1.", []), ("Langkah 2.", ["Cek: hasil yang harus terlihat dengan angka eksak."])],
    expected=["Hasil yang diharapkan dengan angka eksak."], notes=["Catatan untuk penguji."],
)]
