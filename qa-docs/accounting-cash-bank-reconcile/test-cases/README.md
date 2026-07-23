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

| File | `TC-CBRAM-{NN}.md` (NN = 01–14, 2 digit) |

| Frontmatter `tc_code` | `TC-CBRAM-01` (sama dengan nama file tanpa `.md`) |

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

| 01 | [TC-CBRAM-01.md](./TC-CBRAM-01.md) | TC-01 | Happy path auto-match AR (Customer Payment) multi-invoice | High |

| 02 | [TC-CBRAM-02.md](./TC-CBRAM-02.md) | TC-02 | Happy path auto-match AP (Supplier Payment) | High |

| 03 | [TC-CBRAM-03.md](./TC-CBRAM-03.md) | TC-03 | Skip-on-tie: dua kandidat GL nominal & tanggal sama | High |

| 04 | [TC-CBRAM-04.md](./TC-CBRAM-04.md) | TC-04 | Journal manual (bukan AP/AR) tidak auto-match | High |

| 05 | [TC-CBRAM-05.md](./TC-CBRAM-05.md) | TC-05 | Amount tidak exact tidak auto-match | Medium |

| 06 | [TC-CBRAM-06.md](./TC-CBRAM-06.md) | TC-06 | Tanggal journal ≠ bank statement tidak auto-match | Medium |

| 07 | [TC-CBRAM-07.md](./TC-CBRAM-07.md) | TC-07 | Side tidak sesuai (Received vs Credit) | Medium |

| 08 | [TC-CBRAM-08.md](./TC-CBRAM-08.md) | TC-08 | GL sudah ter-link tidak double-match | High |

| 09 | [TC-CBRAM-09.md](./TC-CBRAM-09.md) | TC-09 | Journal AP/AR belum Approved tidak eligible | High |

| 10 | [TC-CBRAM-10.md](./TC-CBRAM-10.md) | TC-10 | Header CBR Approved — auto-match tidak jalan | High |

| 11 | [TC-CBRAM-11.md](./TC-CBRAM-11.md) | TC-11 | Re-import: baris matched tidak diproses ulang | Medium |

| 12 | [TC-CBRAM-12.md](./TC-CBRAM-12.md) | TC-12 | Import gagal all-or-nothing — tidak partial auto-match | High |

| 13 | [TC-CBRAM-13.md](./TC-CBRAM-13.md) | TC-13 | Multi cash/bank COA vs 1 baris total — tidak auto-match | Medium |

| 14 | [TC-CBRAM-14.md](./TC-CBRAM-14.md) | TC-14 | Unmatch setelah auto-match tetap normal | High |



## Warm-up (ETM-15298)



| TC | File | Title |

|----|------|-------|

| TC-CBR-001 | [TC-CBR-001.md](./TC-CBR-001.md) | CREATE header Period + Bank BCA 001 + Open (W3) |

| TC-CBR-002 | [TC-CBR-002.md](./TC-CBR-002.md) | IMPORT 1 baris Received bank statement (W4) |



## Catatan



- Expected result mengacu pada skenario sumber ETM-15298 + scope MVP di atas; requirement CBR masih `draft` — flag gap jika behavior staging beda.

- **TC-CBRAM-11** dan **TC-CBRAM-14** bergantung pada hasil **TC-CBRAM-01** (happy path AR).

