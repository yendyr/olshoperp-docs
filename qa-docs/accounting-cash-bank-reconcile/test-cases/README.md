# Test Cases — ETM-15298 Auto-Match CBR AP/AR



**Card:** Auto-match bank statement dengan GL Cash/Bank dari Account Payment (AP) / Account Receivable (AR)  

**Menu:** Cash/Bank Reconcile (`accounting-cash-bank-reconcile`)  

**UI route:** `/accounting/cash-bank-reconcile`  

**Status:** draft  

**Sumber skenario:** [testcase-auto-match-cbr-ap-ar.md](../testcase-auto-match-cbr-ap-ar.md)  

**Requirement ref:** [requirement.md](../requirement.md) (status draft)



## Penamaan file



| Konvensi | Contoh |

|---|---|

| File | `TC-CBRAM-{NNN}.md` (NNN = 001–014, 3 digit) |

| Frontmatter `tc_code` | `TC-CBRAM-001` (sama dengan nama file tanpa `.md`) |

| Sumber skenario | `TC-01` … `TC-14` di [testcase-auto-match-cbr-ap-ar.md](../testcase-auto-match-cbr-ap-ar.md) |



## Scope MVP



- Exact amount + exact date (same day)

- Skip-on-tie jika kandidat > 1

- Filter hanya `transaction_reference_text` = `Payment to Supplier` / `Payment from Customer`

- Journal status **Approved**

- Header CBR status **Draft/Open**



## Daftar TC



| # | File | Sumber | Title | Priority |

|---|------|--------|-------|----------|

| 01 | [TC-CBRAM-001.md](./TC-CBRAM-001.md) | TC-01 | Happy path auto-match AR (Customer Payment) multi-invoice | High |

| 02 | [TC-CBRAM-002.md](./TC-CBRAM-002.md) | TC-02 | Happy path auto-match AP (Supplier Payment) | High |

| 03 | [TC-CBRAM-003.md](./TC-CBRAM-003.md) | TC-03 | Skip-on-tie: dua kandidat GL nominal & tanggal sama | High |

| 04 | [TC-CBRAM-004.md](./TC-CBRAM-004.md) | TC-04 | Journal manual (bukan AP/AR) tidak auto-match | High |

| 05 | [TC-CBRAM-005.md](./TC-CBRAM-005.md) | TC-05 | Amount tidak exact tidak auto-match | Medium |

| 06 | [TC-CBRAM-006.md](./TC-CBRAM-006.md) | TC-06 | Tanggal journal ≠ bank statement tidak auto-match | Medium |

| 07 | [TC-CBRAM-007.md](./TC-CBRAM-007.md) | TC-07 | Side tidak sesuai (Received vs Credit) | Medium |

| 08 | [TC-CBRAM-008.md](./TC-CBRAM-008.md) | TC-08 | GL sudah ter-link tidak double-match | High |

| 09 | [TC-CBRAM-009.md](./TC-CBRAM-009.md) | TC-09 | Journal AP/AR belum Approved tidak eligible | High |

| 10 | [TC-CBRAM-010.md](./TC-CBRAM-010.md) | TC-10 | Header CBR Approved — auto-match tidak jalan | High |

| 11 | [TC-CBRAM-011.md](./TC-CBRAM-011.md) | TC-11 | Re-import: baris matched tidak diproses ulang | Medium |

| 12 | [TC-CBRAM-012.md](./TC-CBRAM-012.md) | TC-12 | Import gagal all-or-nothing — tidak partial auto-match | High |

| 13 | [TC-CBRAM-013.md](./TC-CBRAM-013.md) | TC-13 | Multi cash/bank COA vs 1 baris total — tidak auto-match | Medium |

| 14 | [TC-CBRAM-014.md](./TC-CBRAM-014.md) | TC-14 | Unmatch setelah auto-match tetap normal | High |



## Warm-up (ETM-15298)



| TC | File | Title |

|----|------|-------|

| TC-CBR-001 | [TC-CBR-001.md](./TC-CBR-001.md) | CREATE header Period + Bank BCA 001 + Open (W3) |

| TC-CBR-002 | [TC-CBR-002.md](./TC-CBR-002.md) | IMPORT 1 baris Received bank statement (W4) |



## ETM-15522 — Period lock

**Card:** [ETM-15522](https://erpintegration.atlassian.net/browse/ETM-15522) — lock Cash Bank Account + Period setelah **Approve**.  
**Urutan validasi:** Fiscal Period dulu → baru CBR Approved lock.  
**Instant Settlement:** hanya di **Approve** (bukan start import).  
**Jangan** run TC-CBRAM-001–014 untuk card ini.

Reuse precondition: [TC-CBR-001.md](./TC-CBR-001.md). Jalankan dulu `TC-CBR-004` (Approve → lock aktif) sebelum TC lock menu lain.

| TC Code | Title | Status | Automated | Last Updated |
|---------|-------|--------|-----------|-------------|
| TC-CBR-003 | [CBR CREATE/APPROVE — fiscal missing/Closed dulu](./TC-CBR-003.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-004 | [CBR APPROVE — fiscal Open, lock aktif](./TC-CBR-004.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-005 | [JOURNAL CREATE — fiscal dulu, lalu lock](./TC-CBR-005.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-006 | [JOURNAL IMPORT — fiscal dulu, lalu lock](./TC-CBR-006.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-007 | [ACCOUNT PAYMENT CREATE — fiscal dulu, lalu lock](./TC-CBR-007.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-008 | [ACCOUNT PAYMENT IMPORT — fiscal dulu, lalu lock](./TC-CBR-008.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-009 | [ACCOUNT RECEIVE CREATE — fiscal dulu, lalu lock](./TC-CBR-009.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-010 | [ACCOUNT RECEIVE IMPORT — fiscal dulu, lalu lock](./TC-CBR-010.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-011 | [CREDIT NOTE CREATE — fiscal dulu, lalu lock](./TC-CBR-011.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-012 | [CREDIT NOTE IMPORT — fiscal dulu, lalu lock](./TC-CBR-012.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-013 | [DEBIT NOTE CREATE — fiscal dulu, lalu lock](./TC-CBR-013.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-014 | [DEBIT NOTE IMPORT — fiscal dulu, lalu lock](./TC-CBR-014.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-015 | [Account A di tanggal luar Period tetap muncul](./TC-CBR-015.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-016 | [Account B (COA lain) di tanggal Period tetap boleh](./TC-CBR-016.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-017 | [INSTANT SETTLEMENT APPROVE — fiscal dulu](./TC-CBR-017.md) | draft | ❌ | 2026-08-14 |
| TC-CBR-018 | [INSTANT SETTLEMENT APPROVE — CBR lock](./TC-CBR-018.md) | draft | ❌ | 2026-08-14 |

Nomor urut final via `#renumber-tc accounting-cash-bank-reconcile`.

## ETM-15856 — Matching Slideover 2 Arah (Bank↔GL) + Quick Journal

**Card:** [ETM-15856](https://erpintegration.atlassian.net/browse/ETM-15856) — Matching Slideover 2 arah (Bank↔GL) + Quick Journal  
**Menu:** Cash/Bank Reconcile (`accounting-cash-bank-reconcile`)  
**UI Route:** `/accounting/cash-bank-reconcile/edit/{id}` $\rightarrow$ Tab **Reconcile Process** $\rightarrow$ *See more / See Other……*  
**Request ID:** `recvtRTKlaj9VS`  
**Status:** In Progress / Testing Progress  

### Ringkasan & Solusi Produk
1. **Modal Dialog $\rightarrow$ Slideover:** Mengganti modal kecil tengah dengan panel Slideover di sisi kanan agar area kerja lebih leluasa dan halaman reconcile utama di latar belakang tetap terlihat.
2. **Matching Dua Arah (POV A & POV B):**
   - **POV A (Default):** Anchor = 1 Bank Statement $\rightarrow$ Multi-select GL Not Reconciled $\rightarrow$ Tersedia tombol `+ Create Quick Journal`.
   - **POV B:** Anchor = 1 GL Journal Detail $\rightarrow$ Multi-select Bank Statements Not Reconciled (*import-only*, tanpa opsi create bank statement).
3. **Difference Bar:** Menghitung `Anchor Amount - Selected Amount = Difference`. Tombol **Match** hanya aktif (*enabled*) jika selisih tepat **0**.
4. **Quick Journal Modal:** Form ringkas di atas slideover (tanpa redirect) tanpa field *store*, *attachment*, *transaction reference*, atau *rate*. Baris Kas/Bank berada di atas dengan amount read-only ($\Sigma$ offset).
5. **Decisions Locked:**
   - **D1:** Match tetap manual (setelah Save & Approve, GL baru hanya auto-selected, tombol Match tidak auto-klik).
   - **D2:** Bank Statement import-only (tidak ada create bank statement dari panel).
   - **D3:** Quick Journal ringkas tanpa field pelengkap.
   - **D4:** Change Anchor via picker menampilkan notice footer dan otomatis membersihkan centangan seleksi sebelumnya.
   - **D5:** Amount Kas/Bank di Quick Journal bersifat read-only (mengikuti total offset).

---

### Acceptance Criteria (AC-1 s/d AC-13)

| Kode AC | Kategori | Kriteria Penerimaan (Acceptance Criteria) |
| :---: | :--- | :--- |
| **AC-1** | UI / Slideover | Tombol *See Other / See more* membuka panel **Slideover** di sisi kanan; halaman reconcile utama di belakangnya tetap terlihat. |
| **AC-2** | POV Switch | Terdapat switch **POV A** dan **POV B**. Tombol *Create Quick Journal* hanya muncul pada **POV A**. |
| **AC-3** | Validation | Terdapat **Difference Bar** interaktif; tombol **Match** hanya *enabled* jika nilai selisih tepat `0` (*exact match*). |
| **AC-4** | Workflow | Setelah *Save & Approve* jurnal, baris GL baru otomatis terpilih (*auto-checked*), tetapi **tidak otomatis melakukan Match** (user wajib klik manual tombol Match). |
| **AC-5** | Bank Statement | Bank Statement bersifat **import-only** (tidak ada opsi/tombol create bank statement dari panel). |
| **AC-6** | Anchor Picker | Mengganti anchor via picker menampilkan notice *"Switching the line/transaction clears the current selection below"* dan otomatis mengosongkan seleksi sebelumnya. |
| **AC-7** | Quick Journal Form | Modal Quick Journal berbentuk form ringkas (tanpa field *attachment*, *store*, *transaction reference*, dan *rate*). |
| **AC-8** | Form Fields | Pada form Quick Journal, nilai Amount Kas/Bank bersifat *read-only* mengikuti total offset ($\Sigma$ offset); hanya field *Description* yang bisa diedit; COA Kas/Bank yang sedang direconcile tidak boleh dipilih sebagai offset account. |
| **AC-9** | Draft Warning | Memilih *Save as draft* memunculkan konfirmasi/warning bahwa jurnal draft tidak akan masuk ke daftar matching. |
| **AC-10** | Approval Flow | Memilih *Save & Approve* menampilkan popup rekap/konfirmasi posting, dan setelah sukses baris GL baru langsung tercentang dengan selisih 0. |
| **AC-11** | Permission | User tanpa permission *approve journal* hanya melihat opsi *Save as draft*. |
| **AC-12** | Document State | Jika dokumen Cash/Bank Reconcile induk sudah berstatus *Approved*, tombol *Create Quick Journal* dan *Match* dinonaktifkan/tidak tersedia. |
| **AC-13** | POV B Match | Pada **POV B**, pencocokan 1 baris GL dengan banyak baris Bank Statement (import) dapat dilakukan selama total nominalnya sama persis (selisih 0). |

---

## Catatan

- Expected result mengacu pada skenario sumber ETM-15298 + scope MVP di atas; requirement CBR masih `draft` — flag gap jika behavior staging beda.
- **TC-CBRAM-011** dan **TC-CBRAM-014** bergantung pada hasil **TC-CBRAM-001** (happy path AR).


