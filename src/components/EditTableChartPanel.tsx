
import { useState, useEffect } from "react";
import { useDashboard } from "@/context/DashboardContext";
import { ChartItemType, TableColumnConfig, TableRowData } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Table } from "lucide-react";
import TableChartEditor from "./TableChartEditor";
import { toast } from "sonner";

interface EditTableChartPanelProps {
  item: ChartItemType;
}

const EditTableChartPanel: React.FC<EditTableChartPanelProps> = ({ item }) => {
  const { dispatch } = useDashboard();
  const [title, setTitle] = useState(item.title);
  const [columns, setColumns] = useState<TableColumnConfig[]>(item.data.tableColumns || []);
  const [rows, setRows] = useState<TableRowData[]>(item.data.tableRows || []);

  useEffect(() => {
    setTitle(item.title);
    setColumns(item.data.tableColumns || []);
    setRows(item.data.tableRows || []);
  }, [item]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: item.id,
        updates: { title },
      },
    });
    toast.success("Table title updated");
  };

  const handleColumnsChange = (newColumns: TableColumnConfig[]) => {
    setColumns(newColumns);
    
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: item.id,
        updates: {
          data: {
            ...item.data,
            tableColumns: newColumns,
          },
        },
      },
    });
  };

  const handleRowsChange = (newRows: TableRowData[]) => {
    setRows(newRows);
    
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: item.id,
        updates: {
          data: {
            ...item.data,
            tableRows: newRows,
          },
        },
      },
    });
  };

  const createSampleData = () => {
    // Create sample columns if none exist
    if (columns.length === 0) {
      const sampleColumns: TableColumnConfig[] = [
        { id: 'name', header: 'Name', accessor: 'name', align: 'left', visible: true },
        { id: 'value', header: 'Value', accessor: 'value', align: 'right', visible: true },
        { id: 'status', header: 'Status', accessor: 'status', align: 'center', visible: true }
      ];
      setColumns(sampleColumns);
      
      // Create sample rows
      const sampleRows: TableRowData[] = [
        { name: 'Item 1', value: '100', status: 'Active' },
        { name: 'Item 2', value: '200', status: 'Pending' },
        { name: 'Item 3', value: '300', status: 'Completed' }
      ];
      setRows(sampleRows);
      
      // Update in dashboard context
      dispatch({
        type: "UPDATE_ITEM",
        payload: {
          id: item.id,
          updates: {
            data: {
              ...item.data,
              tableColumns: sampleColumns,
              tableRows: sampleRows,
            },
          },
        },
      });
      
      toast.success("Sample data created");
    } else {
      toast.error("Table already has columns. Clear the table first to create sample data.");
    }
  };
  
  const clearTable = () => {
    setColumns([]);
    setRows([]);
    
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: item.id,
        updates: {
          data: {
            ...item.data,
            tableColumns: [],
            tableRows: [],
          },
        },
      },
    });
    
    toast.success("Table cleared");
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Table className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Edit Table</h2>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="chart-title">Table Title</Label>
        <Input
          id="chart-title"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
        />
      </div>

      <div className="flex gap-2">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={createSampleData}
          className="flex-1"
        >
          Create Sample Data
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={clearTable}
          className="flex-1"
        >
          Clear Table
        </Button>
      </div>

      <Separator />

      <TableChartEditor
        columns={columns}
        rows={rows}
        onColumnsChange={handleColumnsChange}
        onRowsChange={handleRowsChange}
      />
    </div>
  );
};

export default EditTableChartPanel;
