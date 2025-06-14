
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
  isValid: boolean;
  errors: string[];
}

export interface DataValidationResult {
  isValid: boolean;
  warnings: string[];
}

export function processData(rawData: string): ProcessedData {
  const rows = rawData.trim().split('\n');
  if (rows.length === 0) {
    return { 
      rows: [], 
      columns: [], 
      isValid: false, 
      errors: ['No data found'] 
    };
  }

  // Detect delimiter - check if first row has tabs or commas
  const firstRow = rows[0];
  const delimiter = firstRow.includes('\t') ? '\t' : ',';
  
  const headers = firstRow.split(delimiter).map(header => header.trim());
  const dataRows = rows.slice(1).map(row => row.split(delimiter).map(cell => cell.trim()));

  const columns: DataColumn[] = headers.map(header => ({
    name: header,
    type: 'text',
    description: ''
  }));

  const processedRows: DataRow[] = dataRows.map(row => {
    const rowData: DataRow = {};
    row.forEach((cell, index) => {
      if (index < headers.length) {
        rowData[headers[index]] = cell;
      }
    });
    return rowData;
  });

  const errors: string[] = [];
  if (headers.length === 0) {
    errors.push('No column headers found');
  }
  if (dataRows.length === 0) {
    errors.push('No data rows found');
  }

  return {
    rows: processedRows,
    columns: columns,
    isValid: errors.length === 0,
    errors: errors
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
