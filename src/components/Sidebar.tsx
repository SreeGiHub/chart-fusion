import { useDashboard } from "@/context/DashboardContext";
import { ChartItemType, ChartType, ComplexDataPoint } from "@/types";
import { DEFAULT_COLORS } from "@/utils/chartUtils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Activity, Type, Trash2, Plus, X } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Add a new empty label
  const addNewLabel = () => {
    const newLabels = [...selectedItem.data.labels, `Label ${selectedItem.data.labels.length + 1}`];
    
    // Add a value for each dataset
    const newDatasets = selectedItem.data.datasets.map(dataset => {
      const newData = [...dataset.data];
      newData.push(typeof newData[0] === 'object' ? { x: newData.length, y: 0 } : 0);
      
      return {
        ...dataset,
        data: newData
      };
    });
    
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: selectedItem.id,
        updates: {
          data: {
            labels: newLabels,
            datasets: newDatasets,
          },
        },
      },
    });
    
    toast.success("New label added");
  };

  // Delete a label and its associated data point
  const deleteLabel = (index: number) => {
    if (selectedItem.data.labels.length <= 1) {
      toast.error("Cannot delete the last label");
      return;
    }
    
    const newLabels = selectedItem.data.labels.filter((_, i) => i !== index);
    
    const newDatasets = selectedItem.data.datasets.map(dataset => {
      const newData = dataset.data.filter((_, i) => i !== index);
      return {
        ...dataset,
        data: newData
      };
    });
    
    dispatch({
      type: "UPDATE_ITEM",
      payload: {
        id: selectedItem.id,
        updates: {
          data: {
            labels: newLabels,
            datasets: newDatasets,
          },
        },
      },
    });
    
    toast.success("Label deleted");
  };

  // Add a new dataset
  const addNewDataset = () => {
    const newDatasets = [...selectedItem.data.datasets];
    const datasetIndex = newDatasets.length;
    
    // Create data with same length as labels
    const data = selectedItem.data.labels.map((_, i) => {
      if (selectedItem.type === "scatter" || selectedItem.type === "bubble") {
        return { x: i, y: 0 };
      }
      return 0;
    });
    
    newDatasets.push({
      label: `Dataset ${datasetIndex + 1}`,
      data,
      backgroundColor: DEFAULT_COLORS[datasetIndex % DEFAULT_COLORS.length],
      borderColor: DEFAULT_COLORS[datasetIndex % DEFAULT_COLORS.length],
      borderWidth: 2,
    });
    
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
    
    toast.success("New dataset added");
  };

  // Delete a dataset
  const deleteDataset = (index: number) => {
    if (selectedItem.data.datasets.length <= 1) {
      toast.error("Cannot delete the last dataset");
      return;
    }
    
    const newDatasets = selectedItem.data.datasets.filter((_, i) => i !== index);
    
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
    
    toast.success("Dataset deleted");
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

    if (selectedItem.type === "pie" || selectedItem.type === "donut") {
      // For pie/donut charts, we handle colors per slice (label)
      return (
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Colors</h3>
          <div className="grid grid-cols-2 gap-2">
            {selectedItem.data.labels.map((label, index) => {
              const colors = Array.isArray(selectedItem.data.datasets[0].backgroundColor)
                ? (selectedItem.data.datasets[0].backgroundColor as string[])
                : [selectedItem.data.datasets[0].backgroundColor || DEFAULT_COLORS[0]];
                
              return (
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
              );
            })}
          </div>
        </div>
      );
    } 
    
    // For other chart types, we handle colors per dataset
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Dataset Colors</h3>
        {selectedItem.data.datasets.map((dataset, datasetIndex) => (
          <div key={datasetIndex} className="space-y-1 border p-2 rounded-md">
            <Label className="text-xs font-medium">{dataset.label}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={
                  Array.isArray(dataset.backgroundColor)
                    ? dataset.backgroundColor[0]
                    : (dataset.backgroundColor as string) || DEFAULT_COLORS[datasetIndex % DEFAULT_COLORS.length]
                }
                onChange={(e) => {
                  const newDatasets = [...selectedItem.data.datasets];
                  newDatasets[datasetIndex] = {
                    ...newDatasets[datasetIndex],
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
                  Array.isArray(dataset.backgroundColor)
                    ? dataset.backgroundColor[0]
                    : (dataset.backgroundColor as string) || DEFAULT_COLORS[datasetIndex % DEFAULT_COLORS.length]
                }
                onChange={(e) => {
                  const newDatasets = [...selectedItem.data.datasets];
                  newDatasets[datasetIndex] = {
                    ...newDatasets[datasetIndex],
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
                className="h-6 text-xs flex-1"
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="sidebar fixed right-0 top-0 h-screen w-80 bg-white border-l shadow-lg p-4 overflow-y-auto animate-slide-in z-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Edit {selectedItem.type.charAt(0).toUpperCase() + selectedItem.type.slice(1)}</h2>
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
            <ScrollArea className="h-[calc(100vh-250px)] pr-3">
              <div className="space-y-6">
                {/* Datasets Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Datasets</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addNewDataset}
                      className="h-7"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Dataset
                    </Button>
                  </div>
                  
                  {selectedItem.data.datasets.map((dataset, datasetIndex) => (
                    <div key={datasetIndex} className="border rounded-md p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`dataset-${datasetIndex}`}>Dataset {datasetIndex + 1}</Label>
                        {selectedItem.data.datasets.length > 1 && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteDataset(datasetIndex)}
                            className="h-7 text-red-500 hover:text-red-700"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </div>
                      
                      <Input
                        id={`dataset-${datasetIndex}`}
                        value={dataset.label || ""}
                        onChange={(e) => updateDatasetLabel(datasetIndex, e.target.value)}
                        placeholder="Dataset name"
                      />
                      
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={
                            Array.isArray(dataset.backgroundColor)
                              ? dataset.backgroundColor[0]
                              : (dataset.backgroundColor as string) || DEFAULT_COLORS[datasetIndex % DEFAULT_COLORS.length]
                          }
                          onChange={(e) => {
                            const newDatasets = [...selectedItem.data.datasets];
                            newDatasets[datasetIndex] = {
                              ...newDatasets[datasetIndex],
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
                            Array.isArray(dataset.backgroundColor)
                              ? dataset.backgroundColor[0]
                              : (dataset.backgroundColor as string) || DEFAULT_COLORS[datasetIndex % DEFAULT_COLORS.length]
                          }
                          onChange={(e) => {
                            const newDatasets = [...selectedItem.data.datasets];
                            newDatasets[datasetIndex] = {
                              ...newDatasets[datasetIndex],
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
                          className="h-6 text-xs flex-1"
                          placeholder="Color code"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Labels and Values Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Labels & Values</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addNewLabel}
                      className="h-7"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Label
                    </Button>
                  </div>
                  
                  <div className="border rounded-md p-3 space-y-3">
                    {selectedItem.data.labels.map((label, labelIndex) => (
                      <div key={labelIndex} className="border-b pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <Label htmlFor={`label-${labelIndex}`} className="text-sm">
                            Label {labelIndex + 1}
                          </Label>
                          {selectedItem.data.labels.length > 1 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteLabel(labelIndex)}
                              className="h-7 text-red-500 hover:text-red-700"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                        
                        <Input
                          id={`label-${labelIndex}`}
                          value={label}
                          onChange={(e) => updateLabelText(labelIndex, e.target.value)}
                          className="mb-2"
                          placeholder="Label name"
                        />
                        
                        {selectedItem.data.datasets.map((dataset, datasetIndex) => (
                          <div key={`${datasetIndex}-${labelIndex}`} className="grid grid-cols-2 gap-2 mt-2">
                            <Label htmlFor={`value-${datasetIndex}-${labelIndex}`} className="text-xs">
                              {dataset.label || `Dataset ${datasetIndex + 1}`} Value
                            </Label>
                            <Input
                              id={`value-${datasetIndex}-${labelIndex}`}
                              type="number"
                              value={
                                typeof dataset.data[labelIndex] === 'object'
                                  ? (dataset.data[labelIndex] as ComplexDataPoint).y
                                  : dataset.data[labelIndex] || 0
                              }
                              onChange={(e) => updateDataValue(datasetIndex, labelIndex, e.target.value)}
                              size={1}
                              className="h-7"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          {renderColorPickers()}
          
          {/* Additional style options */}
          {selectedItem.type !== "text" && selectedItem.type !== "pie" && selectedItem.type !== "donut" && (
            <div className="space-y-4 mt-4">
              <h3 className="text-sm font-medium">Chart Options</h3>
              
              {/* Border width option */}
              <div className="space-y-2">
                <Label htmlFor="border-width" className="text-xs">
                  Border Width
                </Label>
                <Input
                  id="border-width"
                  type="number"
                  min="0"
                  max="10"
                  value={selectedItem.data.datasets[0].borderWidth || 1}
                  onChange={(e) => {
                    const newDatasets = [...selectedItem.data.datasets];
                    newDatasets.forEach((dataset, index) => {
                      newDatasets[index] = {
                        ...dataset,
                        borderWidth: Number(e.target.value),
                      };
                    });

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
                />
              </div>
              
              {/* Fill option for area and line charts */}
              {(selectedItem.type === "area" || selectedItem.type === "line") && (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="fill-area"
                    checked={selectedItem.data.datasets[0].fill}
                    onChange={(e) => {
                      const newDatasets = [...selectedItem.data.datasets];
                      newDatasets.forEach((dataset, index) => {
                        newDatasets[index] = {
                          ...dataset,
                          fill: e.target.checked,
                        };
                      });

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
                    className="h-4 w-4"
                  />
                  <Label htmlFor="fill-area" className="text-sm">
                    Fill Area
                  </Label>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sidebar;
