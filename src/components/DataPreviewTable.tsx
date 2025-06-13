
import React from "react";
import { DataColumn, ProcessedData } from "@/utils/dataProcessor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface DataPreviewTableProps {
  data: ProcessedData;
  onColumnUpdate: (columnIndex: number, updates: Partial<DataColumn>) => void;
}

const DataPreviewTable: React.FC<DataPreviewTableProps> = ({
  data,
  onColumnUpdate,
}) => {
  const handleColumnNameChange = (columnIndex: number, newName: string) => {
    onColumnUpdate(columnIndex, { name: newName });
  };

  const handleColumnTypeChange = (columnIndex: number, newType: DataColumn['type']) => {
    onColumnUpdate(columnIndex, { type: newType });
  };

  const getTypeColor = (type: DataColumn['type']) => {
    switch (type) {
      case 'number': return 'bg-blue-100 text-blue-800';
      case 'date': return 'bg-green-100 text-green-800';
      case 'boolean': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Column Configuration */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Column Configuration</h3>
        <div className="grid gap-3">
          {data.columns.map((column, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-1 space-y-1">
                <Label htmlFor={`col-name-${index}`} className="text-xs">
                  Column Name
                </Label>
                <Input
                  id={`col-name-${index}`}
                  value={column.name}
                  onChange={(e) => handleColumnNameChange(index, e.target.value)}
                  className="h-8"
                />
              </div>
              
              <div className="w-32 space-y-1">
                <Label htmlFor={`col-type-${index}`} className="text-xs">
                  Data Type
                </Label>
                <Select
                  value={column.type}
                  onValueChange={(value) => handleColumnTypeChange(index, value as DataColumn['type'])}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge className={getTypeColor(column.type)}>
                  {column.type}
                </Badge>
                {column.hasErrors ? (
                  <AlertTriangle className="h-4 w-4 text-amber-500" title={column.errorMessage} />
                ) : (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Preview */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Data Preview ({data.rows.length} rows)</h3>
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-64 overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="w-12 p-2 text-left font-medium">#</th>
                  {data.columns.map((column, index) => (
                    <th key={index} className="p-2 text-left font-medium min-w-24">
                      <div className="flex items-center gap-1">
                        <span>{column.name}</span>
                        {column.hasErrors && (
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.slice(0, 10).map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                    <td className="p-2 text-muted-foreground font-mono">{rowIndex + 1}</td>
                    {data.columns.map((column, colIndex) => (
                      <td key={colIndex} className="p-2">
                        <span className="truncate block max-w-32" title={String(row[column.name])}>
                          {row[column.name] !== undefined && row[column.name] !== null
                            ? String(row[column.name])
                            : '-'
                          }
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
                {data.rows.length > 10 && (
                  <tr>
                    <td colSpan={data.columns.length + 1} className="p-3 text-center text-muted-foreground">
                      ... and {data.rows.length - 10} more rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPreviewTable;
