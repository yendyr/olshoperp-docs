import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

export type StockRemappingImportRow = {
  origin?: string;
  remapped?: string;
  qty?: string | number;
  unit?: string;
  description?: string;
};

/**
 * Template AS-IS Stock Remapping: SKU Origin, Remapped To SKU, Qty, Unit, Description.
 */
export async function writeStockRemappingImportXlsx(
  filePath: string,
  rows: StockRemappingImportRow[],
  options?: { headersOnly?: boolean },
): Promise<string> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sheet1');
  sheet.addRow([
    'SKU Origin',
    'Remapped To SKU',
    'Qty',
    'Unit',
    'Description',
  ]);

  if (!options?.headersOnly) {
    for (const row of rows) {
      sheet.addRow([
        row.origin ?? '',
        row.remapped ?? '',
        row.qty ?? '',
        row.unit ?? '',
        row.description ?? '',
      ]);
    }
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}
