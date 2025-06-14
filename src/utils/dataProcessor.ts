export interface DataRow {
  [key: string]: any;
}

export interface DataColumn {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean';
  description?: string;
  hasErrors?: boolean;
  errorMessage?: string;
}

export interface ProcessedData {
  rows: DataRow[];
  columns: DataColumn[];
}

export interface DataValidationResult {
  isValid: boolean;
  warnings: string[];
}

export function processData(rawData: string): ProcessedData {
  const rows = rawData.trim().split('\n');
  if (rows.length === 0) {
    return { rows: [], columns: [] };
  }

  const headers = rows[0].split(',').map(header => header.trim());
  const dataRows = rows.slice(1).map(row => row.split(',').map(cell => cell.trim()));

  const columns: DataColumn[] = headers.map(header => ({
    name: header,
    type: 'text'
  }));

  const processedRows: DataRow[] = dataRows.map(row => {
    const rowData: DataRow = {};
    row.forEach((cell, index) => {
      rowData[headers[index]] = cell;
    });
    return rowData;
  });

  return {
    rows: processedRows,
    columns: columns
  };
}

export function validateData(data: ProcessedData): DataValidationResult {
  const warnings: string[] = [];
  let isValid = true;

  if (data.rows.length === 0) {
    warnings.push('No data rows found.');
    isValid = false;
  }

  if (data.columns.length === 0) {
    warnings.push('No columns found.');
    isValid = false;
  }

  return {
    isValid: isValid,
    warnings: warnings
  };
}
