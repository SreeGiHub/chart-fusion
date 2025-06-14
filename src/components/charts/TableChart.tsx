
import React, { useState } from 'react';
import { ChartData, TableColumnConfig, TableRowData } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, Database } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface TableChartProps {
  data: ChartData;
  onDataUpdate?: (newData: ChartData) => void;
}

const TableChart: React.FC<TableChartProps> = ({ data, onDataUpdate }) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null);
  const [editingHeader, setEditingHeader] = useState<string | null>(null);

  const columns = data.tableColumns || [];
  const rows = data.tableRows || [];

  const handleCellEdit = (rowIndex: number, columnId: string, value: string) => {
    if (!onDataUpdate) return;

    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnId]: value };
    
    onDataUpdate({
      ...data,
      tableRows: newRows
    });
    
    setEditingCell(null);
  };

  const handleHeaderEdit = (columnId: string, newHeader: string) => {
    if (!onDataUpdate) return;

    const newColumns = columns.map(col => 
      col.id === columnId ? { ...col, header: newHeader } : col
    );
    
    onDataUpdate({
      ...data,
      tableColumns: newColumns
    });
    
    setEditingHeader(null);
  };

  const addColumn = () => {
    if (!onDataUpdate) return;

    const newColumnId = `col${columns.length + 1}`;
    const newColumn: TableColumnConfig = {
      id: newColumnId,
      header: `Column ${columns.length + 1}`,
      accessor: newColumnId,
      align: 'left'
    };

    const newRows = rows.map(row => ({ ...row, [newColumnId]: '' }));

    onDataUpdate({
      ...data,
      tableColumns: [...columns, newColumn],
      tableRows: newRows
    });
  };

  const deleteRow = (rowIndex: number) => {
    if (!onDataUpdate) return;

    const newRows = rows.filter((_, index) => index !== rowIndex);
    onDataUpdate({
      ...data,
      tableRows: newRows
    });
  };

  return (
    <div className="w-full h-full overflow-auto p-4">
      {/* Data Management Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-4 h-4" />
          <h4 className="text-sm font-medium">Data</h4>
        </div>
        <Separator className="mb-3" />
        <Button onClick={addColumn} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />
          Add Column
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.id} className="p-3 text-left border-b">
                  {editingHeader === column.id ? (
                    <Input
                      defaultValue={column.header}
                      onBlur={(e) => handleHeaderEdit(column.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleHeaderEdit(column.id, e.currentTarget.value);
                        }
                      }}
                      autoFocus
                      className="h-8"
                    />
                  ) : (
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => setEditingHeader(column.id)}
                    >
                      {column.header}
                      <Edit2 className="w-3 h-3 opacity-50" />
                    </div>
                  )}
                </th>
              ))}
              <th className="w-10 p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column.id} className="p-3 border-b">
                    {editingCell?.row === rowIndex && editingCell?.col === column.id ? (
                      <Input
                        defaultValue={row[column.id]?.toString() || ''}
                        onBlur={(e) => handleCellEdit(rowIndex, column.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleCellEdit(rowIndex, column.id, e.currentTarget.value);
                          }
                        }}
                        autoFocus
                        className="h-8"
                      />
                    ) : (
                      <div 
                        className="cursor-pointer hover:bg-gray-100 p-1 rounded min-h-[24px]"
                        onClick={() => setEditingCell({ row: rowIndex, col: column.id })}
                      >
                        {row[column.id]?.toString() || ''}
                      </div>
                    )}
                  </td>
                ))}
                <td className="p-3 border-b">
                  <Button
                    onClick={() => deleteRow(rowIndex)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableChart;
