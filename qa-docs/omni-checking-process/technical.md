---
doc_type: technical
menu: omni-checking-process
menu_name: "Checking Process"
version: 1.0
last_updated: 2026-10-09
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
  - ../omni-picking-process/technical.md
  - ../omni-checking-list/technical.md
---

# Checking Process — Technical

**FE:** `olshoperp-frontend/src/pages/Omni/CheckingProcess/` (atau path setara Transfer Checking)  
**BE:** `Modules/OmniChannel/Http/Controllers/TransferCheckingController.php` → delegates `StockMutationTransferController`  
**API:** `omnichannel/transfer-checking/*`

## Architecture

Thin wrapper seperti Picking Process. Approve scoped ke destination warehouse **`sequence = 2`** (virtual Checking). `process_type` checking (`PROCESS_TYPE_CHECKING`).

```mermaid
flowchart LR
  FE[CheckingProcess UI] --> TCC[TransferCheckingController]
  TCC --> SMTC[StockMutationTransferController]
  TCC -->|destination.sequence=2| WH[Virtual WH Checking]
```

## Key behaviors

| Topic | Detail |
|-------|--------|
| Eligibility | TF destination `sequence = 2`; status DRAFT/OPEN/APPROVED |
| Approve | QR / TF code / SO / platform_order_id — pola sama Picking |
| Upstream | Picking TF (`PROCESS_TYPE_PICKING`) approved |
| Downstream | Packing Process / Packing List |
| vs Checking List | List = dokumen QC operasional (scan/replace); Process = approve TF stage |

## Related

[Picking Process technical](../omni-picking-process/technical.md) · [Checking List](../omni-checking-list/technical.md) · [Failed Ship rantai](../supplychain-failed-ship/requirement.md)
