
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProcessedData, DataColumn, DataValidationResult } from "@/utils/dataProcessor";
import ConfigureColumnsHeader from "./ConfigureColumnsHeader";
import ColumnTableRow from "./ColumnTableRow";

interface ConfigureColumnsStepProps {
  processedData: ProcessedData;
  validation: DataValidationResult | null;
  onColumnUpdate: (columnIndex: number, updates: Partial<DataColumn>) => void;
  onNext: () => void;
}

const ConfigureColumnsStep: React.FC<ConfigureColumnsStepProps> = ({
  processedData,
  validation,
  onColumnUpdate,
  onNext,
}) => {
  const handleAddColumn = () => {
    const newColumn: DataColumn = {
      name: `Column_${processedData.columns.length + 1}`,
      type: 'text',
      description: ''
    };
    
    // Add new column to the processed data
    const newIndex = processedData.columns.length;
    onColumnUpdate(newIndex, newColumn);
  };

  const handleDeleteColumn = (columnIndex: number) => {
    // This would need to be handled by the parent component
    // For now, we'll just clear the column data
    onColumnUpdate(columnIndex, { name: '', type: 'text', description: '' });
  };

  // Sample descriptions for the preloaded sample data
  const getSampleDescription = (columnName: string): string => {
    const sampleDescriptions: Record<string, string> = {
      'Name': 'Full name of the sales representative',
      'Age': 'Age of the sales representative in years',
      'Sales': 'Individual sales amount achieved in USD',
      'Region': 'Geographic sales region (North, South, East, West)',
      'Date': 'Date of the sales transaction (YYYY-MM-DD format)',
      'Product': 'Type of product sold (Laptop, Phone, Tablet, Monitor, etc.)',
      'Revenue': 'Total revenue generated from the sale in USD',
      'Units_Sold': 'Number of units sold in the transaction',
      'Customer_Rating': 'Customer satisfaction rating on a scale of 1-5',
      'Market_Share': 'Market share percentage for the product category'
    };
    
    return sampleDescriptions[columnName] || `Description for ${columnName} column`;
  };

  // Auto-populate descriptions if they're empty (for sample data)
  React.useEffect(() => {
    processedData.columns.forEach((column, index) => {
      if (!column.description) {
        const sampleDesc = getSampleDescription(column.name);
        if (sampleDesc !== `Description for ${column.name} column`) {
          onColumnUpdate(index, { description: sampleDesc });
        }
      }
    });
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden space-y-6">
      <ConfigureColumnsHeader
        processedData={processedData}
        validation={validation}
        onNext={onNext}
        onAddColumn={handleAddColumn}
      />

      <div className="flex-1 overflow-hidden">
        <div className="space-y-4 h-full">
          <div className="flex-1 border rounded-lg overflow-hidden">
            <ScrollArea className="h-[400px] w-full">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold min-w-[200px]">Column Name</TableHead>
                    <TableHead className="font-semibold min-w-[150px]">Data Type</TableHead>
                    <TableHead className="font-semibold min-w-[300px]">Description (AI Context)</TableHead>
                    <TableHead className="font-semibold w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedData.columns.map((column, index) => (
                    <ColumnTableRow
                      key={index}
                      column={column}
                      index={index}
                      onColumnUpdate={onColumnUpdate}
                      onDeleteColumn={handleDeleteColumn}
                    />
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
          
          {processedData.rows.length > 0 && (
            <div className="text-sm text-gray-600">
              Preview: {processedData.rows.length} rows of data ready for visualization
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t bg-white">
        <div className="text-sm text-gray-500">
          Step 2 of 3: Configure your data columns
        </div>
      </div>
    </div>
  );
};

export default ConfigureColumnsStep;
