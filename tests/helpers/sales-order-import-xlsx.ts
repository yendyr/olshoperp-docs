import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

export type SalesOrderImportRow = {
  transactionDate: string;
  customerCode: string;
  storeName: string;
  platformOrderId: string;
  shipperServiceCode?: string;
  trackingNumber?: string;
  sku: string;
  qty: number;
  unit: string;
  price: number;
};

/**
 * Sheet 1 header exact (SoT sales-order-general):
 * Transaction Date, Customer Code, Store Name, Platform Order ID,
 * Shipper Service Code, Tracking Number, System Product SKU, Qty, Unit, Price
 */
export async function writeSalesOrderImportXlsx(
  filePath: string,
  rows: SalesOrderImportRow[],
): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');
  sheet.addRow([
    'Transaction Date',
    'Customer Code',
    'Store Name',
    'Platform Order ID',
    'Shipper Service Code',
    'Tracking Number',
    'System Product SKU',
    'Qty',
    'Unit',
    'Price',
  ]);
  for (const row of rows) {
    sheet.addRow([
      row.transactionDate,
      row.customerCode,
      row.storeName,
      row.platformOrderId,
      row.shipperServiceCode ?? '',
      row.trackingNumber ?? '',
      row.sku,
      row.qty,
      row.unit,
      row.price,
    ]);
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}
