
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableColumnConfig, TableRowData } from "@/types";
import { Plus, Trash2, GripVertical, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";

interface TableChartEditorProps {
  columns: TableColumnConfig[];
  rows: TableRowData[];
  onColumnsChange: (columns: TableColumnConfig[]) => void;
  onRowsChange: (rows: TableRowData[]) => void;
}

const TableChartEditor: React.FC<TableChartEditorProps> = ({ 
  columns, 
  rows, 
  onColumnsChange, 
  onRowsChange 
}) => {
  const [newColumnName, setNewColumnName] = useState("");
  
  const addColumn = () => {
    if (!newColumnName.trim()) return;
    
    const columnId = newColumnName.toLowerCase().replace(/\s+/g, '_');
    const newColumn: TableColumnConfig = {
      id: columnId,
      header: newColumnName,
      accessor: columnId,
      align: 'left',
    };
    
    const updatedColumns = [...columns, newColumn];
    onColumnsChange(updatedColumns);
    
    // Add this column to all existing rows with empty value
    const updatedRows = rows.map(row => ({
      ...row,
      [columnId]: ''
    }));
    onRowsChange(updatedRows);
    
    setNewColumnName("");
  };
  
  const removeColumn = (columnId: string) => {
    const updatedColumns = columns.filter(column => column.id !== columnId);
    onColumnsChange(updatedColumns);
    
    // Remove this column from all rows
    const updatedRows = rows.map(row => {
      const newRow = { ...row };
      delete newRow[columnId];
      return newRow;
    });
    onRowsChange(updatedRows);
  };
  
  const updateColumnHeader = (columnId: string, newHeader: string) => {
    const updatedColumns = columns.map(column => 
      column.id === columnId ? { ...column, header: newHeader } : column
    );
    onColumnsChange(updatedColumns);
  };
  
  const updateColumnAlign = (columnId: string, align: 'left' | 'center' | 'right') => {
    const updatedColumns = columns.map(column => 
      column.id === columnId ? { ...column, align } : column
    );
    onColumnsChange(updatedColumns);
  };
  
  const addRow = () => {
    // Create a new row with empty values for all columns
    const newRow: TableRowData = {};
    columns.forEach(column => {
      newRow[column.accessor] = '';
    });
    
    onRowsChange([...rows, newRow]);
  };
  
  const removeRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    onRowsChange(updatedRows);
  };
  
  const updateCellValue = (rowIndex: number, columnId: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [columnId]: value
    };
    onRowsChange(updatedRows);
  };
  
  const getAlignmentIcon = (align: string | undefined) => {
    switch (align) {
      case 'center': return <AlignCenter className="h-4 w-4" />;
      case 'right': return <AlignRight className="h-4 w-4" />;
      default: return <AlignLeft className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Table Columns</h3>
        
        <div className="space-y-2">
          {columns.map((column, index) => (
            <div key={column.id} className="flex items-center gap-2">
              <div className="p-2 text-muted-foreground">
                <GripVertical className="h-4 w-4" />
              </div>
              <Input
                value={column.header}
                onChange={(e) => updateColumnHeader(column.id, e.target.value)}
                className="flex-1"
                placeholder="Column header"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    {getAlignmentIcon(column.align)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => updateColumnAlign(column.id, 'left')}>
                    <AlignLeft className="mr-2 h-4 w-4" /> Left
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateColumnAlign(column.id, 'center')}>
                    <AlignCenter className="mr-2 h-4 w-4" /> Center
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateColumnAlign(column.id, 'right')}>
                    <AlignRight className="mr-2 h-4 w-4" /> Right
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeColumn(column.id)}
                className="h-9 w-9 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 mt-2">
          <Input
            placeholder="New column name"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addColumn()}
          />
          <Button variant="outline" onClick={addColumn}>
            <Plus className="h-4 w-4 mr-1" /> Add Column
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Table Data</h3>
        
        {rows.length > 0 && (
          <div className="border rounded-md overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="w-10"></th>
                  {columns.map(column => (
                    <th key={column.id} className="p-2 text-left text-xs font-semibold">
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                    <td className="p-2 text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeRow(rowIndex)}
                        className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </td>
                    {columns.map(column => (
                      <td key={column.id} className="p-2">
                        <Input
                          value={row[column.accessor] || ''}
                          onChange={(e) => updateCellValue(rowIndex, column.accessor, e.target.value)}
                          className="h-8 text-xs"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <Button variant="outline" onClick={addRow} className="w-full mt-2">
          <Plus className="h-4 w-4 mr-1" /> Add Row
        </Button>
      </div>
    </div>
  );
};

export default TableChartEditor;
