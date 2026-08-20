import openpyxl
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Purchase Order Detail"
headers = ["Product ID", "System Product SKU", "Kolom Qty Salah", "Unit", "Unit Price", "Disc.", "Description", "Required Delivery Date", "VAT Salah", "VAT Code", "VAT Type"]
ws.append(headers)
ws.append(["", "SKU-PO-VAT-TEST01", 10, "PCS", 50000, 0, "Test Corrupt Header", "", "yes", "PPN12", "exclude"])
wb.save("/Users/yemimatifani/Documents/GitHub/olshoperp-docs/tests/fixtures/po-import/po-corrupt-header-tc5.xlsx")