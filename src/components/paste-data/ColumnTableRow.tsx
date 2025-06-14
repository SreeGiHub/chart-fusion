
import React from "react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { 
  AlertTriangle,
  CheckCircle,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataColumn } from "@/utils/dataProcessor";

interface ColumnTableRowProps {
  column: DataColumn;
  index: number;
  onColumnUpdate: (columnIndex: number, updates: Partial<DataColumn>) => void;
  onDeleteColumn: (columnIndex: number) => void;
}

const ColumnTableRow: React.FC<ColumnTableRowProps> = ({
  column,
  index,
  onColumnUpdate,
  onDeleteColumn,
}) => {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="min-w-[200px]">
        <Input
          value={column.name}
          onChange={(e) => onColumnUpdate(index, { name: e.target.value })}
          className="w-full"
          placeholder="Enter column name"
        />
      </TableCell>
      
      <TableCell className="min-w-[150px]">
        <Select
          value={column.type}
          onValueChange={(value) => onColumnUpdate(index, { type: value as DataColumn['type'] })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="boolean">Boolean</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      
      <TableCell className="min-w-[300px]">
        <Input
          placeholder="e.g., 'Monthly sales revenue in USD', 'Customer satisfaction score 1-5'"
          value={column.description || ''}
          onChange={(e) => onColumnUpdate(index, { description: e.target.value })}
          className="w-full"
        />
      </TableCell>
      
      <TableCell className="w-[100px]">
        <div className="flex items-center gap-2">
          {column.hasErrors ? (
            <div className="relative group">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {column.errorMessage}
              </div>
            </div>
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          
          <Button
            onClick={() => onDeleteColumn(index)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ColumnTableRow;
