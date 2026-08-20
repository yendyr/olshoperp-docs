import openpyxl
wb = openpyxl.Workbook()
ws = wb.active
ws.title = "Purchase Order Detail"
headers = ["Product ID", "System Product SKU", "PO Qty", "Unit", "Unit Price", "Disc.", "Description", "Required Delivery Date", "VAT (yes/no)", "VAT Code", "VAT Type"]
ws.append(headers)
ws.append(["", "SKU-VAT-delete", 10, "PCS", 50000, 0, "TC-6 No Tax Basis Test", "", "", "", "exclude"])
wb.save("/Users/yemimatifani/Documents/GitHub/olshoperp-docs/tests/fixtures/po-import/po-tc6-no-tax-basis.xlsx")