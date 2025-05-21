
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { TableColumnConfig, TableRowData } from "@/types";
import { 
  PlusCircle, 
  X, 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TableChartEditorProps {
  columns: TableColumnConfig[];
  rows: TableRowData[];
  onColumnsChange: (columns: TableColumnConfig[]) => void;
  onRowsChange: (rows: TableRowData[]) => void;
}

// Predefined colors for cells and rows
const CELL_COLORS = [
  "#ffffff", // White (default)
  "#f3f4f6", // Light gray
  "#e5e7eb", // Gray
  "#fee2e2", // Light red
  "#e6f4ea", // Light green
  "#e0f2fe", // Light blue
  "#fef3c7", // Light yellow
  "#f3e8ff", // Light purple
];

const TableChartEditor: React.FC<TableChartEditorProps> = ({
  columns,
  rows,
  onColumnsChange,
  onRowsChange,
}) => {
  const [activeTab, setActiveTab] = useState("columns");

  const addColumn = () => {
    const newId = `col-${Date.now()}`;
    const newColumn: TableColumnConfig = {
      id: newId,
      header: `Column ${columns.length + 1}`,
      accessor: newId,
      align: 'left',
      visible: true,
    };
    
    onColumnsChange([...columns, newColumn]);
    
    // Add this field to existing rows
    if (rows.length > 0) {
      const updatedRows = rows.map(row => ({
        ...row,
        [newId]: '',
      }));
      onRowsChange(updatedRows);
    }
    
    toast.success("Column added");
  };

  const updateColumn = (index: number, updates: Partial<TableColumnConfig>) => {
    const updatedColumns = [...columns];
    updatedColumns[index] = { ...updatedColumns[index], ...updates };
    
    // If column accessor changed, we need to update all rows
    if (updates.accessor && updates.accessor !== columns[index].accessor) {
      const oldAccessor = columns[index].accessor;
      const newAccessor = updates.accessor;
      
      const updatedRows = rows.map(row => {
        const newRow = { ...row };
        newRow[newAccessor] = row[oldAccessor];
        // We don't delete the old property to avoid data loss in case of reverting
        return newRow;
      });
      
      onRowsChange(updatedRows);
    }
    
    onColumnsChange(updatedColumns);
  };

  const removeColumn = (index: number) => {
    if (columns.length <= 1) {
      toast.error("Cannot delete the last column");
      return;
    }
    
    const columnToRemove = columns[index];
    const updatedColumns = columns.filter((_, i) => i !== index);
    onColumnsChange(updatedColumns);
    
    // Remove this field from all rows
    if (rows.length > 0) {
      const updatedRows = rows.map(row => {
        const newRow = { ...row };
        delete newRow[columnToRemove.accessor];
        return newRow;
      });
      onRowsChange(updatedRows);
    }
    
    toast.success("Column removed");
  };

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === columns.length - 1)) {
      return;
    }
    
    const updatedColumns = [...columns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap positions
    [updatedColumns[index], updatedColumns[targetIndex]] = 
    [updatedColumns[targetIndex], updatedColumns[index]];
    
    onColumnsChange(updatedColumns);
  };

  const toggleColumnVisibility = (index: number) => {
    const updatedColumns = [...columns];
    updatedColumns[index].visible = !updatedColumns[index].visible;
    onColumnsChange(updatedColumns);
    
    toast.success(
      updatedColumns[index].visible
        ? `Column "${updatedColumns[index].header}" is now visible`
        : `Column "${updatedColumns[index].header}" is now hidden`
    );
  };

  const setColumnColor = (index: number, color: string) => {
    const updatedColumns = [...columns];
    updatedColumns[index].backgroundColor = color;
    onColumnsChange(updatedColumns);
  };

  const addRow = () => {
    const newRow: TableRowData = {};
    
    // Initialize with empty values for all columns
    columns.forEach(column => {
      newRow[column.accessor] = '';
    });
    
    onRowsChange([...rows, newRow]);
    toast.success("Row added");
  };

  const updateRowValue = (rowIndex: number, columnAccessor: string, value: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [columnAccessor]: value
    };
    onRowsChange(updatedRows);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) {
      toast.error("Cannot delete the last row");
      return;
    }
    
    const updatedRows = rows.filter((_, i) => i !== index);
    onRowsChange(updatedRows);
    toast.success("Row removed");
  };

  const setRowColor = (rowIndex: number, color: string) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      _rowColor: color
    };
    onRowsChange(updatedRows);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="columns">Columns</TabsTrigger>
          <TabsTrigger value="rows">Rows & Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="columns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Table Columns</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={addColumn}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Column</span>
            </Button>
          </div>
          
          <ScrollArea className="h-[400px] pr-4">
            {columns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No columns defined. Add a column to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {columns.map((column, index) => (
                  <div 
                    key={column.id} 
                    className="border rounded-md p-3 space-y-3 bg-background"
                    style={{
                      backgroundColor: column.backgroundColor || undefined
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                        <span className="font-medium text-sm">Column {index + 1}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              title="Set column color"
                            >
                              <Palette className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64" align="end">
                            <div className="grid grid-cols-4 gap-2">
                              {CELL_COLORS.map((color) => (
                                <div
                                  key={color}
                                  className="h-8 w-8 rounded-md cursor-pointer border"
                                  style={{ backgroundColor: color }}
                                  onClick={() => setColumnColor(index, color)}
                                />
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full mt-2"
                              onClick={() => setColumnColor(index, '')}
                            >
                              Clear Color
                            </Button>
                          </PopoverContent>
                        </Popover>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveColumn(index, 'up')}
                          disabled={index === 0}
                          className="h-7 w-7"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveColumn(index, 'down')}
                          disabled={index === columns.length - 1}
                          className="h-7 w-7"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleColumnVisibility(index)}
                          className="h-7 w-7"
                          title={column.visible ? "Hide column" : "Show column"}
                        >
                          {column.visible ? 
                            <Eye className="h-4 w-4" /> : 
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          }
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeColumn(index)}
                          className="h-7 w-7 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`col-header-${index}`} className="text-xs">
                          Header
                        </Label>
                        <Input
                          id={`col-header-${index}`}
                          value={column.header}
                          onChange={(e) => updateColumn(index, { header: e.target.value })}
                          className="h-8"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`col-accessor-${index}`} className="text-xs">
                          Field ID
                        </Label>
                        <Input
                          id={`col-accessor-${index}`}
                          value={column.accessor}
                          onChange={(e) => updateColumn(index, { accessor: e.target.value })}
                          className="h-8"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`col-align-${index}`} className="text-xs">
                          Alignment
                        </Label>
                        <Select
                          value={column.align || 'left'}
                          onValueChange={(value) => 
                            updateColumn(index, { align: value as 'left' | 'center' | 'right' })
                          }
                        >
                          <SelectTrigger id={`col-align-${index}`} className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">
                              <div className="flex items-center gap-2">
                                <AlignLeft className="h-3.5 w-3.5" /> 
                                <span>Left</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="center">
                              <div className="flex items-center gap-2">
                                <AlignCenter className="h-3.5 w-3.5" /> 
                                <span>Center</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="right">
                              <div className="flex items-center gap-2">
                                <AlignRight className="h-3.5 w-3.5" /> 
                                <span>Right</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`col-width-${index}`} className="text-xs">
                          Width (px, optional)
                        </Label>
                        <Input
                          id={`col-width-${index}`}
                          type="number"
                          value={column.width || ''}
                          onChange={(e) => updateColumn(index, { 
                            width: e.target.value ? Number(e.target.value) : undefined 
                          })}
                          className="h-8"
                          placeholder="Auto"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="rows" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Table Data</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={addRow}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Row</span>
            </Button>
          </div>
          
          {columns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You need to define columns first before adding data.
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No data rows defined. Add a row to get started.
            </div>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left text-xs font-semibold w-10">#</th>
                    {columns.filter(col => col.visible !== false).map((column) => (
                      <th 
                        key={column.id} 
                        className={`p-2 text-left text-xs font-semibold ${
                          column.align ? `text-${column.align}` : ''
                        }`}
                        style={{
                          width: column.width ? `${column.width}px` : undefined,
                          backgroundColor: column.backgroundColor || undefined
                        }}
                      >
                        {column.header}
                      </th>
                    ))}
                    <th className="p-2 text-center w-24">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="max-h-[300px] overflow-auto">
                  {rows.map((row, rowIndex) => (
                    <tr 
                      key={rowIndex} 
                      className={rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}
                      style={{ backgroundColor: row._rowColor || undefined }}
                    >
                      <td className="p-2 text-xs font-medium">{rowIndex + 1}</td>
                      {columns.filter(col => col.visible !== false).map((column) => (
                        <td 
                          key={`${rowIndex}-${column.id}`}
                          className={`p-2 ${
                            column.align ? `text-${column.align}` : ''
                          }`}
                          style={{ backgroundColor: column.backgroundColor || undefined }}
                        >
                          <Input 
                            value={row[column.accessor] || ''}
                            onChange={(e) => updateRowValue(rowIndex, column.accessor, e.target.value)}
                            className="h-7 text-xs"
                          />
                        </td>
                      ))}
                      <td className="p-2 text-center">
                        <div className="flex justify-center items-center space-x-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                              >
                                <Palette className="h-3.5 w-3.5" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-64" align="end">
                              <div className="grid grid-cols-4 gap-2">
                                {CELL_COLORS.map((color) => (
                                  <div
                                    key={color}
                                    className="h-8 w-8 rounded-md cursor-pointer border"
                                    style={{ backgroundColor: color }}
                                    onClick={() => setRowColor(rowIndex, color)}
                                  />
                                ))}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full mt-2"
                                onClick={() => setRowColor(rowIndex, '')}
                              >
                                Clear Color
                              </Button>
                            </PopoverContent>
                          </Popover>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeRow(rowIndex)}
                            className="h-6 w-6 text-red-500 hover:text-red-700"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TableChartEditor;
