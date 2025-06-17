
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartTemplate, getTemplatesByCategory } from "@/utils/chartTemplates";
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  AreaChart,
  ChartScatter,
  Target,
  Table,
  FileText,
  Activity,
  Layers,
  TrendingUp
} from "lucide-react";

interface PickAChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChartsSelected: (selectedTemplates: ChartTemplate[]) => void;
}

const iconMap = {
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  ChartScatter,
  Target,
  Table,
  FileText,
  Activity,
  Layers,
  TrendingUp
};

const PickAChartDialog: React.FC<PickAChartDialogProps> = ({
  open,
  onOpenChange,
  onChartsSelected,
}) => {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const categorizedTemplates = getTemplatesByCategory();

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleConfirm = () => {
    const selectedChartTemplates = Object.values(categorizedTemplates)
      .flat()
      .filter(template => selectedTemplates.includes(template.id));
    
    onChartsSelected(selectedChartTemplates);
    onOpenChange(false);
    setSelectedTemplates([]);
  };

  const handleCancel = () => {
    setSelectedTemplates([]);
    onOpenChange(false);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Column & Bar': 'bg-orange-100 border-orange-200',
      'Line & Area': 'bg-blue-100 border-blue-200',
      'Pie & Donut': 'bg-purple-100 border-purple-200',
      'Scatter & Bubble': 'bg-green-100 border-green-200',
      'Data & KPI': 'bg-pink-100 border-pink-200'
    };
    return colors[category] || 'bg-gray-100 border-gray-200';
  };

  const getCategoryTextColor = (category: string) => {
    const colors = {
      'Column & Bar': 'text-orange-600',
      'Line & Area': 'text-blue-600',
      'Pie & Donut': 'text-purple-600',
      'Scatter & Bubble': 'text-green-600',
      'Data & KPI': 'text-pink-600'
    };
    return colors[category] || 'text-gray-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Pick Your Charts</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Select multiple chart types to visualize your data. You can choose from different categories.
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6 pr-4">
              {Object.entries(categorizedTemplates).map(([category, templates]) => (
                <div key={category} className={`rounded-xl border-2 p-6 ${getCategoryColor(category)}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold text-lg ${getCategoryTextColor(category)}`}>
                      {category}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {templates.filter(t => selectedTemplates.includes(t.id)).length} selected
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {templates.map((template) => {
                      const IconComponent = iconMap[template.icon as keyof typeof iconMap];
                      const isSelected = selectedTemplates.includes(template.id);
                      
                      return (
                        <div
                          key={template.id}
                          className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-sm ${
                            isSelected
                              ? 'bg-white border-blue-300 shadow-md'
                              : 'bg-white/70 border-gray-200 hover:bg-white'
                          }`}
                          onClick={() => handleTemplateToggle(template.id)}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleTemplateToggle(template.id)}
                            className="flex-shrink-0"
                          />
                          
                          {IconComponent && (
                            <IconComponent className="h-5 w-5 flex-shrink-0 text-gray-600" />
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {template.title}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              {template.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedTemplates.length} chart{selectedTemplates.length !== 1 ? 's' : ''} selected
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={selectedTemplates.length === 0}
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
            >
              Create {selectedTemplates.length} Chart{selectedTemplates.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PickAChartDialog;
