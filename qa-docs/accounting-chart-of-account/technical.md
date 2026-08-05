---
doc_type: technical
menu: accounting-chart-of-account
menu_name: "Chart of Account (Master COA)"
version: 1.0
last_updated: 2026-07-30
owner: QA - Yemima
status: review
related_docs:
  - ./knowledge-base.md
  - ./requirement.md
---

# Chart of Account (Master COA) — Technical Documentation

> **Review** — AS-IS diverifikasi terhadap codebase per 2026-07-30. Perilaku (behavior) SoT = [requirement v1.0](./requirement.md).

**Stack:** Laravel 13 · Horizon (queue import/export) · Vue 3 · MariaDB

---

## 0. Metadata & Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-30 | QA - Yemima | Technical awal AS-IS: controller, tree, picker select2 varian, import/export pipeline, cascade, Gap Registry `GAP-COA-01..04` |

---

## 1. File Map

### Backend (`Modules/Accounting`)

| Layer | Path |
|-------|------|
| Controller | `Http/Controllers/ChartOfAccountController.php` |
| Class controller | `Http/Controllers/ChartOfAccountClassController.php` |
| Entity COA | `Entities/ChartOfAccount.php` (extends `MainModel`, `SoftDeletes`) |
| Entity Class | `Entities/ChartOfAccountClass.php` |
| Entity Tree | `Entities/CoaTree.php` (relasi `coaTree`, `parent`, `all_childs`) |
| Import | `Import/CoaImport.php` · `Jobs/CoaImportJob.php` |
| Import log/history | `Entities/CoaImportLog.php` · `Entities/CoaImportHistory.php` |
| Export | `Jobs/CoaExportJob.php` · `Jobs/CoaExportExcelJob.php` · `Entities/CoaExportFile.php` · `Exports/CoaTemplateExport.php` |
| Policy | `Policies/ChartOfAccountPolicy.php` |
| Seeder | `Database/Seeders/ChartOfAccountClassSeeder.php` (7 class) · `ChartOfAccountSeeder.php` |
| Routes | `Routes/api.php` (grup `chart-of-account.`) |
| Traits | `TreeHandlerTrait` (`renderTree`, `updateChildStatus`), `AuditHandlerTrait` |

### Frontend (`olshoperp-frontend/src/pages/Accounting/master/COA/`)

| Item | Path |
|------|------|
| Datalist | `DataList.vue` |
| Form (create/edit) | `Form.vue` |
| Import log view | `ImportLog.vue` |
| Router | `src/router/index.ts` → `/accounting/chart-of-account`, `.../create`, `.../edit/:id` |

---

## 2. API Routes

| Method | Path | Action | Notes |
|--------|------|--------|-------|
| GET | `chart-of-account` | `index` | Datalist |
| POST | `chart-of-account` | `store` | Create + `coaTree` (dipakai juga oleh import, `with_auth=false`) |
| GET | `chart-of-account/{id}` | `show` | Detail + `is_view_only` + `parent_coa` |
| PUT | `chart-of-account/{id}` | `update` | Cascade status/class; guard class change |
| DELETE | `chart-of-account/{id}` | `destroy` | Guard relasi + child |
| GET | `chart-of-account/tree` | `tree` | Render tree (`renderTree`) |
| GET | `chart-of-account/{id}/audit` | `audit` | Audit datatable |
| GET | `chart-of-account/select2/class` | `select2Class` | 7 COA Class |
| GET | `chart-of-account/select2/parent` | `select2Parent` | Parent picker (lihat §4) |
| GET | `chart-of-account/select2/child` | `select2Child` | Leaf picker (filter `position`/`class`) |
| GET | `chart-of-account/select2/child/{bank\|assets\|liabilities\|equity\|income\|expense\|income-expense}` | varian `select2Child_*` | Picker terfilter class/position per konsumen |
| POST | `chart-of-account/import-excel` | `importExcel` | Upload `file_attachment` (xlsx/xls) |
| GET | `chart-of-account/progress` | `getProgress` | Persentase import berjalan |
| GET | `chart-of-account/import-log` | `importLog` | Log error (≤ 2 hari) |
| GET | `chart-of-account/import-history` | `importHistory` | Riwayat batch import |
| GET | `chart-of-account/check-import-log` | `cekImportLog` | Cek ada log error |
| GET | `chart-of-account/download-template` | `downloadTemplateExcel` | `Template Import COA.xlsx` |
| GET | `chart-of-account/export-file` · `export-progress` · `export-excel` | export batch | `CoaExportFile` + jobs |

---

## 3. Database Key Tables

| Entity | Field kunci |
|--------|-------------|
| `ChartOfAccount` (`accounting_chart_of_accounts`) | `code`, `name`, `description`, `chart_of_account_class_id`, `status`, `is_all_company` (=0), `owned_by`, `deleted_by` |
| `ChartOfAccountClass` (`accounting_chart_of_account_classes`) | `name`, `code`, `position` (Activa/Passiva), `status` |
| `CoaTree` | `coa_id`, `parent_id`, `status`, `owned_by` — **sumber hierarki** parent-child (bukan kolom pada COA) |
| `CoaImportHistory` / `CoaImportLog` | riwayat & error import (log di-`truncate` tiap run) |
| `CoaExportFile` | file export async (`status=0` pending) |

**Relasi view-only (`ChartOfAccount::relations()` + `show`):** `ProductCoaGroupDetail`, `ProductAccounting`, `CompanyAccounting`, `Tax` (`purchase_coa_id`/`sales_coa_id`), `JournalDetail`, `CompanyDetailBank`.

> **Penting:** parent COA disimpan di `CoaTree.parent_id`. Entity juga punya relasi `chart_of_account()` via kolom `parent_id` yang dipakai di cek activate-child — sumber ketidaksinkronan GAP-COA-03.

---

## 4. Picker Logic (select2)

| Endpoint | Filter utama |
|----------|--------------|
| `select2Parent` | `status=1` · `whereNotNull(chart_of_account_class_id)` · **`doesnthave('journal_details')`** (hanya Journal yang dikecualikan → **GAP-COA-01**) |
| `select2Child` | Leaf-only: `whereNotIn(id, parents aktif dari CoaTree)` · `status=1` · optional `position` / `class` (CSV nama class) |
| `select2Child_assets` / `_liabilities` / `_equity` / `_income` / `_expense` / `_income_expense` / `_expense_asset` / `_expense_equity` / `_passiva` / `_incomeOnly` | Sama seperti child, ditambah filter nama/position class spesifik + `owned_by` + opsi `without_coa_cpl` (exclude Current Profit/Loss) |
| `select2Child_bank` | Class `Assets` · `doesnthave('company_detail_bank')` · leaf-only |

---

## 5. Flow Utama

### 5.1 Store / Import create

```mermaid
sequenceDiagram
    participant FE as Vue Form / Import
    participant C as ChartOfAccountController@store
    participant DB as accounting_chart_of_accounts + CoaTree
    FE->>C: code, name, class_id / parent_id
    C->>C: validate required/max50/unique; requiredIf class (parent kosong)
    alt parent_id ada
        C->>C: parent harus status=1 else "Parent not found"; class = class parent
    end
    C->>DB: create COA + coaTree(parent_id)
```

### 5.2 Update + cascade

```mermaid
sequenceDiagram
    participant C as @update
    C->>C: validate; resolve parent (status=1)
    C->>C: jika class berubah -> cek haveRelations() di self + getAllChilds()
    C->>C: activate child: cek parent status (parent_id relation) -> GAP-COA-03
    C->>C: update COA + coaTree.parent_id
    C->>C: updateChildStatus + updateChilds(status, class) rekursif ke descendant
```

### 5.3 Import batch

```mermaid
sequenceDiagram
    participant C as @importExcel
    participant I as CoaImport
    participant J as CoaImportJob
    C->>I: Excel::import (history=processing)
    I->>I: checkFormat (5 kolom exact) + truncate CoaImportLog
    I->>I: validasi per baris (code/parent/name/class)
    alt ada error
        I->>I: insert error_log; history=failed; throw (all-or-nothing)
    else lolos
        I->>J: Bus::batch(jobs) onQueue import_connection_{branch}
        J->>C: importProcess -> store(with_auth=false, status=Active)
    end
```

---

## 6. Invariants

- `is_all_company = 0` untuk seluruh COA (private per `owned_by`).
- Hierarki parent-child = `CoaTree`; leaf = COA yang tidak muncul sebagai `parent_id` di tree aktif.
- Child selalu mewarisi `chart_of_account_class_id` dari parent bila parent di-set.
- Toggle Active & perubahan Class pada parent **cascade** ke seluruh descendant (`updateChilds`).
- Journal/SI/AR/CN hanya posting ke **leaf** Active, bukan parent.
- COA dengan relasi terpakai → tidak bisa dihapus; perubahan Class diblok bila COA/descendant punya relasi.
- Import **create-only**; baris sukses selalu Active; Class direferensikan via **ID numerik**.
- Code unik per `owned_by` (soft-deleted dikecualikan; `uniqueCreate`/`uniqueUpdate`).

---

## 7. Failure Modes & Transaction Boundary

- `store`/`update`/`destroy` dibungkus `DB::transaction` (+ `forceDBRollBack` pada error).
- **Import all-or-nothing:** error terkumpul sebelum dispatch job; tidak ada partial commit di tahap validasi. Job per baris (`importProcess`) tetap punya guard rollback + log per baris.
- **Circular parent** (`isValidParent`) tersedia tapi belum dipanggil di `update` → GAP-COA-02.
- **Activate child** saat parent Inactive memakai referensi `parent_id`/`chart_of_account` → GAP-COA-03.
- Concurrency import: `cekJobExpires` mencegah import paralel (batch `coa_import` belum selesai → "Please wait, other import is being process").

---

## 8. Known Issues

Refer [requirement §11 Gap Registry](./requirement.md#11-gap-registry):

- **GAP-COA-01** — `select2Parent` hanya exclude `journal_details` (bukan semua relasi).
- **GAP-COA-02** — `isValidParent` (anti-circular) tidak dipanggil saat update.
- **GAP-COA-03** — cek activate-child memakai `parent_id`/`chart_of_account`, belum tentu sinkron `CoaTree`.
- **GAP-COA-04** — export mode mapping kolom cenderung sama; "no spaces" Code belum divalidasi backend store.

---

## 9. Tests & QA Notes

- Prioritas regression: cascade status/class ke descendant, guard class-change (self + children), delete guard (child + relasi), import all-or-nothing + pesan per baris, parent-above-child pada import, Code reuse setelah soft-delete.
- Test cases existing: `test-cases/TC-COA-001..004`.
- Frontend: validasi Vue (`Form.vue`) harus selaras pesan controller/import di atas; jika struktur response `show` (`is_view_only`, `parent_coa`) berubah, update mock/unit test FE.

---

## Related Documents

| Doc | Path |
|-----|------|
| Requirement | [requirement.md](./requirement.md) |
| Knowledge Base | [knowledge-base.md](./knowledge-base.md) |
| User Guide | [user-guide.md](./user-guide.md) |
