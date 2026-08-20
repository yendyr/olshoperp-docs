import openpyxl
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Purchase Order Detail"
headers = ["Product ID", "System Product SKU", "PO Qty", "Unit", "Unit Price", "Disc.", "Description", "Required Delivery Date", "VAT (yes/no)", "VAT Code", "VAT Type"]
ws.append(headers)
ws.append(["", "SKU-PO-VAT-TEST01", 10, "PCS", 50000, 0, "Row 1 Empty Code & Type", "", "yes", "", ""])
ws.append(["", "SKU-PO-VAT-TEST01", 5, "PCS", 50000, 0, "Row 2 Empty Type", "", "yes", "PPN12", ""])
wb.save("/Users/yemimatifani/Documents/GitHub/olshoperp-docs/tests/fixtures/po-import/po-tc7-partial-missing.xlsx")