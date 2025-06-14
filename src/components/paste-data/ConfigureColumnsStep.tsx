
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

  // Enhanced sample descriptions for better AI context
  const getSampleDescription = (columnName: string): string => {
    const sampleDescriptions: Record<string, string> = {
      'Name': 'Full name of the sales representative - key identifier for performance tracking and team management',
      'Age': 'Age of the sales representative in years - demographic data for workforce analysis and performance correlation',
      'Sales': 'Individual sales amount achieved in USD - core performance metric for revenue analysis and commission calculations',
      'Region': 'Geographic sales region (North, South, East, West) - territorial segmentation for market analysis and resource allocation',
      'Date': 'Date of the sales transaction in YYYY-MM-DD format - temporal data for trend analysis and seasonal performance tracking',
      'Product': 'Type of product sold (Laptop, Phone, Tablet, Monitor, Keyboard, Mouse, Headset, Webcam) - product category for inventory and sales mix analysis',
      'Revenue': 'Total revenue generated from the sale in USD - financial metric for profitability analysis and business performance',
      'Units_Sold': 'Number of units sold in the transaction - volume metric for inventory management and sales efficiency',
      'Customer_Rating': 'Customer satisfaction rating on a scale of 1-5 - quality metric for service improvement and customer retention',
      'Market_Share': 'Market share percentage for the product category - competitive positioning metric for strategic planning'
    };
    
    return sampleDescriptions[columnName] || `Business context and usage description for ${columnName} column - helps AI understand data purpose for intelligent chart generation`;
  };

  // Auto-populate descriptions if they're empty (for sample data)
  React.useEffect(() => {
    let hasUpdates = false;
    const updates: { index: number; updates: Partial<DataColumn> }[] = [];
    
    processedData.columns.forEach((column, index) => {
      if (!column.description || column.description.trim() === '') {
        const sampleDesc = getSampleDescription(column.name);
        if (sampleDesc !== `Business context and usage description for ${column.name} column - helps AI understand data purpose for intelligent chart generation`) {
          updates.push({ index, updates: { description: sampleDesc } });
          hasUpdates = true;
        }
      }
    });
    
    if (hasUpdates) {
      updates.forEach(({ index, updates }) => {
        onColumnUpdate(index, updates);
      });
    }
  }, [processedData.columns, onColumnUpdate]);

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
                    <TableHead className="font-semibold min-w-[400px]">AI Context Description</TableHead>
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
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <strong>Ready for AI Enhancement:</strong> {processedData.rows.length} rows of data with {processedData.columns.length} configured columns. 
              Rich descriptions will help our AI generate more intelligent and relevant chart suggestions.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t bg-white">
        <div className="text-sm text-gray-500">
          Step 2 of 3: Configure your data columns for AI-powered dashboard generation
        </div>
      </div>
    </div>
  );
};

export default ConfigureColumnsStep;
