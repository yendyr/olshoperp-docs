import openpyxl
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Purchase Order Detail"
headers = ["Product ID", "System Product SKU", "PO Qty", "Unit", "Unit Price", "Disc.", "Description", "Required Delivery Date", "VAT (yes/no)", "VAT Code", "VAT Type"]
ws.append(headers)
ws.append(["", "SKU-PO-VAT-TEST01", 10, "PCS", 50000, 0, "Row 1 Valid Explicit VAT YES", "", "yes", "PPN12", "exclude"])
ws.append(["", "SKU-PO-VAT-TEST01", 5, "PCS", 50000, 0, "Row 2 Invalid VAT Choice", "", "maybe", "PPN12", "exclude"])
ws.append(["", "SKU-PO-VAT-TEST01", 8, "PCS", 15000, 0, "Row 3 Conflict VAT NO with Code", "", "no", "PPN12", "exclude"])
ws.append(["", "SKU-PO-VAT-TEST01", 12, "PCS", 50000, 0, "Row 4 Valid Default VAT", "", "", "", ""])
wb.save("/Users/yemimatifani/Documents/GitHub/olshoperp-docs/tests/fixtures/po-import/po-partial-success-tc3.xlsx")