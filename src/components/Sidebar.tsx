import { useDashboard } from "@/context/DashboardContext";
import { ChartItemType, ChartType, ComplexDataPoint } from "@/types";
import { DEFAULT_COLORS } from "@/utils/chartUtils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Activity, Type, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const Sidebar: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const selectedItem = state.items.find(
    (item) => item.id === state.selectedItemId
  );
  const [activeTab, setActiveTab] = useState("general");

  if (!selectedItem || state.previewMode) {
    return null;
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: selectedItem.id,
        updates: { title: e.target.value },
      },
    });
  };

  const handleChartTypeChange = (type: ChartType) => {
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: selectedItem.id,
        updates: { type },
      },
    });
  };

  const handleDeleteItem = () => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: selectedItem.id,
    });
    toast.success("Item deleted");
  };

  const updateDatasetLabel = (index: number, value: string) => {
    const newDatasets = [...selectedItem.data.datasets];
    newDatasets[index] = {
      ...newDatasets[index],
      label: value,
    };

    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: selectedItem.id,
        updates: {
          data: {
            ...selectedItem.data,
            datasets: newDatasets,
          },
        },
      },
    });
  };

  const updateLabelText = (index: number, value: string) => {
    const newLabels = [...selectedItem.data.labels];
    newLabels[index] = value;

    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: selectedItem.id,
        updates: {
          data: {
            ...selectedItem.data,
            labels: newLabels,
          },
        },
      },
    });
  };

  const updateDataValue = (datasetIndex: number, valueIndex: number, value: string) => {
    const newDatasets = [...selectedItem.data.datasets];
    const newData = [...newDatasets[datasetIndex].data];
    
    if (typeof newData[valueIndex] === 'object' && newData[valueIndex] !== null) {
      const complexPoint = newData[valueIndex] as ComplexDataPoint;
      newData[valueIndex] = { 
        ...complexPoint,
        y: Number(value)
      };
    } else {
      newData[valueIndex] = Number(value);
    }

    newDatasets[datasetIndex] = {
      ...newDatasets[datasetIndex],
      data: newData,
    };

    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: selectedItem.id,
        updates: {
          data: {
            ...selectedItem.data,
            datasets: newDatasets,
          },
        },
      },
    });
  };

  const updateBackgroundColor = (datasetIndex: number, colorIndex: number, value: string) => {
    const newDatasets = [...selectedItem.data.datasets];
    let newColors: string[] = [];
    
    if (Array.isArray(newDatasets[datasetIndex].backgroundColor)) {
      newColors = [...newDatasets[datasetIndex].backgroundColor as string[]];
      newColors[colorIndex] = value;
    } else {
      newColors = DEFAULT_COLORS.map((_, i) => 
        i === colorIndex ? value : DEFAULT_COLORS[i]
      );
    }

    newDatasets[datasetIndex] = {
      ...newDatasets[datasetIndex],
      backgroundColor: newColors,
    };

    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: selectedItem.id,
        updates: {
          data: {
            ...selectedItem.data,
            datasets: newDatasets,
          },
        },
      },
    });
  };

  const renderChartTypeIcon = (type: ChartType) => {
    switch (type) {
      case "bar":
        return <BarChart className="h-4 w-4" />;
      case "line":
        return <LineChart className="h-4 w-4" />;
      case "pie":
      case "donut":
        return <PieChart className="h-4 w-4" />;
      case "area":
        return <Activity className="h-4 w-4" />;
      case "text":
        return <Type className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const renderColorPickers = () => {
    if (!selectedItem.data.datasets[0] || !selectedItem.data.labels) {
      return null;
    }

    const colors = Array.isArray(selectedItem.data.datasets[0].backgroundColor)
      ? (selectedItem.data.datasets[0].backgroundColor as string[])
      : [selectedItem.data.datasets[0].backgroundColor || DEFAULT_COLORS[0]];

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Colors</h3>
        {selectedItem.type === "pie" || selectedItem.type === "donut" ? (
          <div className="grid grid-cols-2 gap-2">
            {selectedItem.data.labels.map((label, index) => (
              <div key={index} className="space-y-1">
                <Label htmlFor={`color-${index}`} className="text-xs">
                  {label}
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    id={`color-${index}`}
                    value={colors[index] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                    onChange={(e) => updateBackgroundColor(0, index, e.target.value)}
                    className="w-10 h-6 p-0"
                  />
                  <Input
                    type="text"
                    value={colors[index] || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                    onChange={(e) => updateBackgroundColor(0, index, e.target.value)}
                    className="h-6 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <Label htmlFor="color" className="text-xs">
              Primary Color
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                id="color"
                value={
                  Array.isArray(selectedItem.data.datasets[0].backgroundColor)
                    ? selectedItem.data.datasets[0].backgroundColor[0]
                    : (selectedItem.data.datasets[0].backgroundColor as string) || DEFAULT_COLORS[0]
                }
                onChange={(e) => {
                  const newDatasets = [...selectedItem.data.datasets];
                  newDatasets[0] = {
                    ...newDatasets[0],
                    backgroundColor: e.target.value,
                    borderColor: e.target.value,
                  };

                  dispatch({
                    type: "UPDATE_ITEM",
                    payload: {
                      id: selectedItem.id,
                      updates: {
                        data: {
                          ...selectedItem.data,
                          datasets: newDatasets,
                        },
                      },
                    },
                  });
                }}
                className="w-10 h-6 p-0"
              />
              <Input
                type="text"
                value={
                  Array.isArray(selectedItem.data.datasets[0].backgroundColor)
                    ? selectedItem.data.datasets[0].backgroundColor[0]
                    : (selectedItem.data.datasets[0].backgroundColor as string) || DEFAULT_COLORS[0]
                }
                onChange={(e) => {
                  const newDatasets = [...selectedItem.data.datasets];
                  newDatasets[0] = {
                    ...newDatasets[0],
                    backgroundColor: e.target.value,
                    borderColor: e.target.value,
                  };

                  dispatch({
                    type: "UPDATE_ITEM",
                    payload: {
                      id: selectedItem.id,
                      updates: {
                        data: {
                          ...selectedItem.data,
                          datasets: newDatasets,
                        },
                      },
                    },
                  });
                }}
                className="h-6 text-xs"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="sidebar fixed right-0 top-0 h-screen w-80 bg-white border-l shadow-lg p-4 overflow-y-auto animate-slide-in z-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Edit {selectedItem.type} Chart</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: "SELECT_ITEM", payload: null })}
        >
          ×
        </Button>
      </div>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={selectedItem.title}
              onChange={handleTitleChange}
            />
          </div>

          {selectedItem.type !== "text" && (
            <div className="space-y-2">
              <Label>Chart Type</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={selectedItem.type === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleChartTypeChange("bar")}
                  className="flex items-center gap-1"
                >
                  <BarChart className="h-4 w-4" />
                  <span>Bar</span>
                </Button>
                <Button
                  variant={selectedItem.type === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleChartTypeChange("line")}
                  className="flex items-center gap-1"
                >
                  <LineChart className="h-4 w-4" />
                  <span>Line</span>
                </Button>
                <Button
                  variant={selectedItem.type === "pie" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleChartTypeChange("pie")}
                  className="flex items-center gap-1"
                >
                  <PieChart className="h-4 w-4" />
                  <span>Pie</span>
                </Button>
                <Button
                  variant={selectedItem.type === "area" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleChartTypeChange("area")}
                  className="flex items-center gap-1"
                >
                  <Activity className="h-4 w-4" />
                  <span>Area</span>
                </Button>
                <Button
                  variant={selectedItem.type === "donut" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleChartTypeChange("donut")}
                  className="flex items-center gap-1"
                >
                  <PieChart className="h-4 w-4" />
                  <span>Donut</span>
                </Button>
                <Button
                  variant={selectedItem.type === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleChartTypeChange("text")}
                  className="flex items-center gap-1"
                >
                  <Type className="h-4 w-4" />
                  <span>Text</span>
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Position & Size</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="pos-x" className="text-xs">
                  X Position
                </Label>
                <Input
                  id="pos-x"
                  type="number"
                  value={selectedItem.position.x}
                  onChange={(e) => {
                    dispatch({
                      type: "MOVE_ITEM",
                      payload: {
                        id: selectedItem.id,
                        position: {
                          ...selectedItem.position,
                          x: Number(e.target.value),
                        },
                      },
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="pos-y" className="text-xs">
                  Y Position
                </Label>
                <Input
                  id="pos-y"
                  type="number"
                  value={selectedItem.position.y}
                  onChange={(e) => {
                    dispatch({
                      type: "MOVE_ITEM",
                      payload: {
                        id: selectedItem.id,
                        position: {
                          ...selectedItem.position,
                          y: Number(e.target.value),
                        },
                      },
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="width" className="text-xs">
                  Width
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={selectedItem.size.width}
                  onChange={(e) => {
                    dispatch({
                      type: "RESIZE_ITEM",
                      payload: {
                        id: selectedItem.id,
                        size: {
                          ...selectedItem.size,
                          width: Number(e.target.value),
                        },
                      },
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs">
                  Height
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={selectedItem.size.height}
                  onChange={(e) => {
                    dispatch({
                      type: "RESIZE_ITEM",
                      payload: {
                        id: selectedItem.id,
                        size: {
                          ...selectedItem.size,
                          height: Number(e.target.value),
                        },
                      },
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <Separator />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Item
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  selected chart from the dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteItem}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          {selectedItem.type === "text" ? (
            <div className="space-y-2">
              <Label htmlFor="text-content">Text Content</Label>
              <textarea
                id="text-content"
                value={selectedItem.data.datasets[0]?.label || ""}
                onChange={(e) => updateDatasetLabel(0, e.target.value)}
                className="w-full min-h-[100px] border rounded-md p-2"
              />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="dataset-label">Dataset Label</Label>
                <Input
                  id="dataset-label"
                  value={selectedItem.data.datasets[0]?.label || ""}
                  onChange={(e) => updateDatasetLabel(0, e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Labels & Values</Label>
                </div>
                <div className="border rounded-md p-3 space-y-3">
                  {selectedItem.data.labels.map((label, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor={`label-${index}`} className="text-xs">
                          Label {index + 1}
                        </Label>
                        <Input
                          id={`label-${index}`}
                          value={label}
                          onChange={(e) => updateLabelText(index, e.target.value)}
                          size={1}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`value-${index}`} className="text-xs">
                          Value {index + 1}
                        </Label>
                        <Input
                          id={`value-${index}`}
                          type="number"
                          value={
                            typeof selectedItem.data.datasets[0].data[index] === 'object'
                              ? (selectedItem.data.datasets[0].data[index] as ComplexDataPoint).y
                              : selectedItem.data.datasets[0].data[index] || 0
                          }
                          onChange={(e) => updateDataValue(0, index, e.target.value)}
                          size={1}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          {renderColorPickers()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
