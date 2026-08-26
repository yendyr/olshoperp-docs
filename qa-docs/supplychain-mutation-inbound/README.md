# Purchase Inbound (Legacy UI) — QA Documentation

Menu **Purchase Inbound** — UI legacy. **Backend & requirement GRN canonical** ada di menu BETA. **Colli v2 = parity** (aturan identik; jangan duplikasi requirement penuh).

| Layer | File | Status |
|-------|------|--------|
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) | draft |
| Requirement | [requirement.md](./requirement.md) | draft |
| Technical | [technical.md](./technical.md) | draft |

**Route:** `supplychain/mutation-inbound` · **Module:** SupplyChain  
**SoT Colli v2:** [`_meta/sot/supplychain-purchase-inbound-colli-v2-source-of-truth.md`](../_meta/sot/supplychain-purchase-inbound-colli-v2-source-of-truth.md)

**Maintenance owner:** QA — Yemima

---

## Canonical documentation

Full GRN + **Colli v2** (Existing/New + Colli Type, lifecycle, import 1 kolom):

→ **[BETA - New Purchase Inbound](../supplychain-new-purchase-inbound/README.md)** (requirement v2.4)

Kedua menu memakai API **`supplychain/mutation-inbound`**. Perbedaan: route UI (`InventoryIn` vs `PurchaseInbound`). **Aturan Colli v2 identik**. Colli ID v1 (koli × isi) ditakedown di kedua UI.

## Related menus

- [BETA - New Purchase Inbound](../supplychain-new-purchase-inbound/README.md) — **canonical**
- [Colli Type](../supplychain-colli-type/README.md) — jenis wadah New Colli
- [Purchase Order](../supplychain-purchase-order/README.md) — source PO
- [Other Inbound](../supplychain-other-inbound/README.md) — non-PO inbound
