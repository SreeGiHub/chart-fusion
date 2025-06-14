
export interface DataColumn {
  name: string;
  type: 'number' | 'date' | 'text' | 'boolean';
  originalName: string;
  values: any[];
  hasErrors: boolean;
  errorMessage?: string;
}

export interface ProcessedData {
  columns: DataColumn[];
  rows: Record<string, any>[];
  isValid: boolean;
  errors: string[];
}

export interface DataValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Auto-detect delimiter (tab vs comma)
export function detectDelimiter(text: string): string {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return ',';
  
  const firstLine = lines[0];
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  
  return tabCount > commaCount ? '\t' : ',';
}

// Parse pasted data into rows and columns
export function parseTabularData(text: string): { headers: string[], rows: string[][] } {
  const delimiter = detectDelimiter(text);
  const lines = text.trim().split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/"/g, ''));
  const rows = lines.slice(1).map(line => 
    line.split(delimiter).map(cell => cell.trim().replace(/"/g, ''))
  );
  
  return { headers, rows };
}

// Detect data type for a column
export function detectDataType(values: string[]): 'number' | 'date' | 'text' | 'boolean' {
  const nonEmptyValues = values.filter(v => v && v.trim());
  if (nonEmptyValues.length === 0) return 'text';
  
  // Check for boolean
  const booleanPattern = /^(true|false|yes|no|y|n|1|0)$/i;
  const booleanCount = nonEmptyValues.filter(v => booleanPattern.test(v.trim())).length;
  if (booleanCount / nonEmptyValues.length > 0.7) return 'boolean';
  
  // Check for numbers
  const numberPattern = /^-?\d*\.?\d+$/;
  const numberCount = nonEmptyValues.filter(v => numberPattern.test(v.trim())).length;
  if (numberCount / nonEmptyValues.length > 0.7) return 'number';
  
  // Check for dates
  const dateCount = nonEmptyValues.filter(v => {
    const parsed = new Date(v.trim());
    return !isNaN(parsed.getTime()) && v.trim().length > 4;
  }).length;
  if (dateCount / nonEmptyValues.length > 0.5) return 'date';
  
  return 'text';
}

// Process raw data into structured format
export function processData(text: string): ProcessedData {
  const { headers, rows } = parseTabularData(text);
  const errors: string[] = [];
  
  // Validation: Check row count - updated to allow up to 100 rows
  if (rows.length > 100) {
    errors.push(`Too many data rows: ${rows.length}. Maximum allowed is 100 (plus header).`);
  }
  
  // Validation: Check for empty headers
  const emptyHeaders = headers.filter((h, i) => !h || h.trim() === '');
  if (emptyHeaders.length > 0) {
    errors.push('Column headers cannot be empty.');
  }
  
  // Validation: Check for duplicate headers
  const duplicateHeaders = headers.filter((h, i) => headers.indexOf(h) !== i);
  if (duplicateHeaders.length > 0) {
    errors.push(`Duplicate column names found: ${[...new Set(duplicateHeaders)].join(', ')}`);
  }
  
  const columns: DataColumn[] = headers.map((header, colIndex) => {
    const columnValues = rows.map(row => row[colIndex] || '');
    const detectedType = detectDataType(columnValues);
    
    // Check for mixed data types
    let hasErrors = false;
    let errorMessage = '';
    
    if (detectedType === 'number') {
      const invalidNumbers = columnValues.filter(v => v && v.trim() && !/^-?\d*\.?\d+$/.test(v.trim()));
      if (invalidNumbers.length > 0) {
        hasErrors = true;
        errorMessage = `Mixed data types detected. Expected numbers but found: ${invalidNumbers.slice(0, 3).join(', ')}${invalidNumbers.length > 3 ? '...' : ''}`;
      }
    }
    
    return {
      name: header,
      originalName: header,
      type: detectedType,
      values: columnValues,
      hasErrors,
      errorMessage
    };
  });
  
  // Convert to rows format
  const processedRows = rows.map((row, rowIndex) => {
    const rowData: Record<string, any> = {};
    headers.forEach((header, colIndex) => {
      const rawValue = row[colIndex] || '';
      const column = columns[colIndex];
      
      // Convert based on detected type
      let processedValue: any = rawValue;
      if (rawValue && rawValue.trim()) {
        switch (column.type) {
          case 'number':
            processedValue = parseFloat(rawValue.trim());
            break;
          case 'boolean':
            processedValue = /^(true|yes|y|1)$/i.test(rawValue.trim());
            break;
          case 'date':
            processedValue = new Date(rawValue.trim());
            break;
          default:
            processedValue = rawValue.trim();
        }
      }
      
      rowData[header] = processedValue;
    });
    return rowData;
  });
  
  return {
    columns,
    rows: processedRows,
    isValid: errors.length === 0,
    errors
  };
}

// Validate processed data
export function validateData(data: ProcessedData): DataValidationResult {
  const errors: string[] = [...data.errors];
  const warnings: string[] = [];
  
  // Check for columns with errors
  data.columns.forEach(column => {
    if (column.hasErrors && column.errorMessage) {
      warnings.push(`${column.name}: ${column.errorMessage}`);
    }
  });
  
  // Check for empty data
  if (data.rows.length === 0) {
    errors.push('No data rows found.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
