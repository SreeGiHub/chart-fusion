
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

function detectColumnType(values: string[], columnName: string): DataColumn['type'] {
  // Filter out empty values for analysis
  const nonEmptyValues = values.filter(val => val && val.trim() !== '');
  
  if (nonEmptyValues.length === 0) {
    return 'text';
  }

  // Check if it's a date column (common date patterns)
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/,  // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/,   // MM-DD-YYYY
  ];
  
  const isDateColumn = nonEmptyValues.some(val => 
    datePatterns.some(pattern => pattern.test(val.trim()))
  );
  
  if (isDateColumn) {
    return 'date';
  }

  // Check if it's a number column
  let numericCount = 0;
  for (const value of nonEmptyValues) {
    const trimmed = value.trim();
    // Check for various number formats including decimals, negatives, percentages
    if (/^-?\d*\.?\d+%?$/.test(trimmed) && !isNaN(parseFloat(trimmed.replace('%', '')))) {
      numericCount++;
    }
  }

  // If 80% or more values are numeric, consider it a number column
  if (numericCount / nonEmptyValues.length >= 0.8) {
    return 'number';
  }

  // Check for boolean patterns
  const booleanValues = ['true', 'false', 'yes', 'no', '1', '0'];
  const isBooleanColumn = nonEmptyValues.every(val => 
    booleanValues.includes(val.toLowerCase().trim())
  );
  
  if (isBooleanColumn) {
    return 'boolean';
  }

  // Default to text
  return 'text';
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

  // Collect all values per column for type detection
  const columnValues: { [key: string]: string[] } = {};
  headers.forEach(header => {
    columnValues[header] = [];
  });

  dataRows.forEach(row => {
    row.forEach((cell, index) => {
      if (index < headers.length) {
        columnValues[headers[index]].push(cell);
      }
    });
  });

  // Create columns with auto-detected types
  const columns: DataColumn[] = headers.map(header => ({
    name: header,
    type: detectColumnType(columnValues[header], header),
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
