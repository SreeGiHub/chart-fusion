import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  FileSpreadsheet,
  Settings,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { processData, validateData, DataColumn, ProcessedData } from "@/utils/dataProcessor";
import { generateChartSuggestions, createChartsFromData } from "@/utils/autoChartGenerator";
import { useDashboard } from "@/context/DashboardContext";
import EnterDataStep from "./paste-data/EnterDataStep";
import ConfigureColumnsStep from "./paste-data/ConfigureColumnsStep";
import PreviewDataStep from "./paste-data/PreviewDataStep";

interface PasteDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PasteDataDialog: React.FC<PasteDataDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { dispatch } = useDashboard();
  const [activeTab, setActiveTab] = useState("enter");
  const [pastedData, setPastedData] = useState("");
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Enhanced sample data with 100 rows
  const sampleData = `Name	Age	Sales	Region	Date	Product	Revenue	Units_Sold	Customer_Rating	Market_Share
John Smith	25	1500	North	2024-01-15	Laptop	25000	50	4.2	12.5
Sarah Johnson	30	2000	South	2024-01-16	Phone	18000	90	4.5	8.3
Mike Davis	28	1800	East	2024-01-17	Tablet	15000	30	4.1	6.7
Lisa Wilson	35	2200	West	2024-01-18	Monitor	12000	20	4.3	9.2
Alex Brown	32	1900	North	2024-01-19	Keyboard	8000	200	4.0	15.1
Emma White	27	2100	South	2024-01-20	Mouse	5000	150	4.4	18.9
Tom Green	29	1750	East	2024-01-21	Headset	10000	40	4.6	11.3
Amy Black	26	1650	West	2024-01-22	Webcam	7500	75	4.2	7.8
Chris Blue	31	2050	North	2024-01-23	Laptop	28000	56	4.3	13.2
Kate Red	33	1850	South	2024-01-24	Phone	19500	95	4.4	8.9
Dave Gold	30	2150	East	2024-01-25	Tablet	16500	35	4.1	7.1
Nina Silver	28	1950	West	2024-01-26	Monitor	13500	25	4.5	9.8
Paul Gray	34	2250	North	2024-01-27	Keyboard	8500	210	4.0	15.7
Rose Pink	29	1700	South	2024-01-28	Mouse	5200	160	4.3	19.2
Jack Orange	27	1600	East	2024-01-29	Headset	10500	42	4.7	11.8
Jill Purple	32	2000	West	2024-01-30	Webcam	8000	80	4.1	8.1
Ben Cyan	30	1800	North	2024-01-31	Laptop	26500	52	4.4	12.8
Zoe Lime	26	1900	South	2024-02-01	Phone	18500	88	4.6	8.5
Max Teal	31	2100	East	2024-02-02	Tablet	15500	32	4.2	6.9
Eva Navy	35	2300	West	2024-02-03	Monitor	14000	22	4.3	10.1
Sam Coral	28	1750	North	2024-02-04	Keyboard	7800	195	3.9	14.8
Ivy Beige	33	2050	South	2024-02-05	Mouse	5300	165	4.5	19.5
Leo Tan	29	1850	East	2024-02-06	Headset	11000	45	4.6	12.1
Mia Rust	27	1650	West	2024-02-07	Webcam	7800	78	4.2	8.3
Rex Azure	32	2200	North	2024-02-08	Laptop	27500	54	4.5	13.5
Ava Mint	30	1950	South	2024-02-09	Phone	19000	92	4.3	8.7
Ian Plum	28	1800	East	2024-02-10	Tablet	16000	33	4.1	7.0
Zara Jade	34	2400	West	2024-02-11	Monitor	14500	24	4.4	10.3
Kyle Sand	31	1900	North	2024-02-12	Keyboard	8200	205	4.0	15.4
Nora Ruby	26	1750	South	2024-02-13	Mouse	5100	155	4.2	18.7
Owen Clay	33	2150	East	2024-02-14	Headset	10800	43	4.7	11.9
Ella Pearl	29	1700	West	2024-02-15	Webcam	7600	76	4.1	8.0
Finn Sage	35	2350	North	2024-02-16	Laptop	28500	58	4.6	13.8
Lily Dusk	27	1850	South	2024-02-17	Phone	18800	89	4.4	8.6
Dean Rose	30	2000	East	2024-02-18	Tablet	15800	31	4.2	6.8
Hope Steel	32	2100	West	2024-02-19	Monitor	13200	21	4.3	9.5
Cole Amber	28	1650	North	2024-02-20	Keyboard	7900	198	3.8	14.9
Maya Ivory	31	1950	South	2024-02-21	Mouse	5400	170	4.5	19.8
Ryan Flame	29	1800	East	2024-02-22	Headset	11200	46	4.8	12.4
Tara Ocean	26	1600	West	2024-02-23	Webcam	8100	82	4.0	8.5
Luke Stone	34	2250	North	2024-02-24	Laptop	27000	53	4.3	13.1
Aria Frost	33	2050	South	2024-02-25	Phone	19200	94	4.5	8.8
Jude Earth	28	1750	East	2024-02-26	Tablet	16200	34	4.1	7.2
Sage Cloud	30	2150	West	2024-02-27	Monitor	14200	23	4.4	9.9
Cade Smoke	32	1900	North	2024-02-28	Keyboard	8300	208	4.0	15.6
Luna Mist	27	1700	South	2024-03-01	Mouse	5250	162	4.3	19.1
Drew Storm	35	2400	East	2024-03-02	Headset	10900	44	4.7	12.0
Iris Snow	29	1850	West	2024-03-03	Webcam	7700	77	4.2	8.2
Noah Tide	31	2000	North	2024-03-04	Laptop	26800	51	4.4	12.9
Vera Wind	28	1950	South	2024-03-05	Phone	18600	87	4.6	8.4
Axel Rain	33	2100	East	2024-03-06	Tablet	15600	32	4.2	6.9
Wren Star	26	1650	West	2024-03-07	Monitor	13800	22	4.3	9.7
Cruz Moon	30	2200	North	2024-03-08	Keyboard	8100	202	3.9	15.2
Skye Sun	32	1800	South	2024-03-09	Mouse	5350	168	4.4	19.4
Blake Fire	34	2300	East	2024-03-10	Headset	11100	47	4.8	12.2
Faye Ice	29	1750	West	2024-03-11	Webcam	7900	79	4.1	8.4
Troy Leaf	27	1900	North	2024-03-12	Laptop	27200	55	4.5	13.3
Vale Sky	31	2050	South	2024-03-13	Phone	19100	91	4.3	8.7
Nash Wave	28	1850	East	2024-03-14	Tablet	16100	33	4.1	7.1
Eden Peak	35	2450	West	2024-03-15	Monitor	14800	25	4.4	10.5
Kane Rock	30	2000	North	2024-03-16	Keyboard	8400	212	4.0	15.8
Lux Dawn	26	1700	South	2024-03-17	Mouse	5150	158	4.2	18.8
Sage Dune	33	2150	East	2024-03-18	Headset	10700	41	4.6	11.7
Roux Glen	32	1950	West	2024-03-19	Webcam	8200	81	4.0	8.6
Clay Reed	29	1800	North	2024-03-20	Laptop	28200	57	4.6	13.6
Neve Hill	27	1850	South	2024-03-21	Phone	18700	86	4.4	8.3
Jett Vale	31	2100	East	2024-03-22	Tablet	15900	31	4.2	6.8
Wynn Park	28	1750	West	2024-03-23	Monitor	13600	21	4.3	9.6
Ford Lake	34	2350	North	2024-03-24	Keyboard	8000	195	3.8	14.7
Bree Woods	30	2000	South	2024-03-25	Mouse	5500	175	4.5	19.9
Dale Grove	32	1900	East	2024-03-26	Headset	11300	48	4.9	12.5
Sage Ridge	29	1650	West	2024-03-27	Webcam	7500	74	4.1	7.9
Quinn Brook	26	1950	North	2024-03-28	Laptop	26500	50	4.3	12.6
Lane Field	35	2250	South	2024-03-29	Phone	19300	96	4.5	8.9
Reed Marsh	31	1850	East	2024-03-30	Tablet	16300	35	4.2	7.3
Vale Stone	28	2050	West	2024-03-31	Monitor	14100	24	4.4	10.0
Sage Cliff	33	1750	North	2024-04-01	Keyboard	8600	218	4.1	16.0
Bryn Coast	27	1700	South	2024-04-02	Mouse	5080	152	4.2	18.5
Knox Creek	30	2150	East	2024-04-03	Headset	10600	39	4.5	11.5
Remy Falls	32	1900	West	2024-04-04	Webcam	8300	83	4.0	8.7
Glen Shore	29	1800	North	2024-04-05	Laptop	27800	56	4.4	13.4
Bria Wells	34	2400	South	2024-04-06	Phone	18900	90	4.6	8.5
Drew Banks	28	1950	East	2024-04-07	Tablet	15700	30	4.1	6.6
Fern Mills	31	2100	West	2024-04-08	Monitor	14400	26	4.3	10.2
Cole Rivers	26	1650	North	2024-04-09	Keyboard	7700	190	3.7	14.4
Blair Ponds	35	2300	South	2024-04-10	Mouse	5600	180	4.6	20.1
Kent Trails	30	2000	East	2024-04-11	Headset	11400	49	4.8	12.6
Sage Moors	33	1850	West	2024-04-12	Webcam	7400	72	4.0	7.7
Gray Peaks	29	1750	North	2024-04-13	Laptop	28800	59	4.7	14.0
June Vales	27	1950	South	2024-04-14	Phone	19400	97	4.4	9.0
Nash Bays	32	2050	East	2024-04-15	Tablet	16400	36	4.2	7.4
Wren Coves	28	1700	West	2024-04-16	Monitor	13900	23	4.3	9.8
Sage Dells	31	2200	North	2024-04-17	Keyboard	8500	215	4.0	15.9
Bree Fords	34	1800	South	2024-04-18	Mouse	5250	165	4.3	19.0
Knox Gates	30	2100	East	2024-04-19	Headset	10800	42	4.6	11.8
Vale Halls	29	1900	West	2024-04-20	Webcam	8000	80	4.1	8.3`;

  const handleTrySampleData = () => {
    setPastedData(sampleData);
    toast.success("Sample data loaded! Click 'Process Data' to continue.");
  };

  const handlePasteData = () => {
    if (!pastedData.trim()) {
      toast.error("Please paste some data first");
      return;
    }

    console.log('Processing pasted data...');
    setIsProcessing(true);
    try {
      const processed = processData(pastedData);
      console.log('Processed data:', processed);
      setProcessedData(processed);
      
      if (processed.isValid) {
        setActiveTab("configure");
        toast.success(
          <div className="flex items-center gap-2">
            <span>Data processed successfully! Found {processed.columns.length} columns and {processed.rows.length} rows.</span>
          </div>
        );
      } else {
        toast.error("Data processing failed. Please check the errors below.");
      }
    } catch (error) {
      console.error("Data processing error:", error);
      toast.error("Failed to process data. Please check your data format.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleColumnUpdate = (columnIndex: number, updates: Partial<DataColumn>) => {
    if (!processedData) return;
    
    console.log('Updating column:', columnIndex, updates);
    const updatedColumns = [...processedData.columns];
    updatedColumns[columnIndex] = { ...updatedColumns[columnIndex], ...updates };
    
    const updatedProcessedData = {
      ...processedData,
      columns: updatedColumns
    };
    
    console.log('Updated processed data:', updatedProcessedData);
    setProcessedData(updatedProcessedData);
  };

  const handleConfigureNext = () => {
    if (!processedData) return;
    
    console.log('Moving to preview step with data:', processedData);
    const validation = validateData(processedData);
    console.log('Validation result:', validation);
    
    if (!validation.isValid) {
      toast.error("Please fix data errors before proceeding");
      return;
    }
    
    setActiveTab("preview");
    toast.success("Configuration complete! Review your data and generate dashboard.");
  };

  const handleGenerateCharts = () => {
    if (!processedData) {
      console.error('No processed data available');
      return;
    }

    console.log('Starting chart generation with data:', processedData);
    
    const validation = validateData(processedData);
    if (!validation.isValid) {
      console.error('Validation failed:', validation);
      toast.error("Please fix data errors before generating charts");
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Generating chart suggestions...');
      const suggestions = generateChartSuggestions(processedData);
      console.log('Generated suggestions:', suggestions);
      
      if (suggestions.length === 0) {
        console.log('No suggestions found, creating default charts');
        // Create at least one default chart
        const defaultSuggestions = [
          {
            type: 'bar' as const,
            columns: processedData.columns.slice(0, 2).map(col => col.name),
            title: 'Data Overview',
            description: 'Bar chart showing your data',
            priority: 1
          }
        ];
        
        const charts = createChartsFromData(processedData, defaultSuggestions);
        console.log('Created default charts:', charts);
        
        charts.forEach(chart => {
          console.log('Adding chart to dashboard:', chart);
          dispatch({ type: "ADD_ITEM", payload: chart });
        });
        
        toast.success("Generated 1 chart from your data! 🎉");
      } else {
        console.log('Creating charts from suggestions...');
        const charts = createChartsFromData(processedData, suggestions);
        console.log('Created charts:', charts);
        
        // Add charts to dashboard
        charts.forEach(chart => {
          console.log('Adding chart to dashboard:', chart);
          dispatch({ type: "ADD_ITEM", payload: chart });
        });

        toast.success(
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <span>Generated {charts.length} charts from your data! 🎉</span>
          </div>
        );
      }
      
      onOpenChange(false);
      
      // Reset state
      resetDialog();
    } catch (error) {
      console.error("Chart generation error:", error);
      toast.error("Failed to generate charts. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetDialog = () => {
    setPastedData("");
    setProcessedData(null);
    setActiveTab("enter");
  };

  const validation = processedData ? validateData(processedData) : null;

  return (
    <Dialog open={open} onOpenChange={(open) => { 
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="max-w-6xl max-h-[95vh] flex flex-col">
        <DialogHeader className="space-y-3 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold">Paste & Visualize</div>
              <div className="text-sm font-normal text-muted-foreground">Transform your data into beautiful charts instantly</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="enter" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span>1. Enter Data</span>
              </TabsTrigger>
              <TabsTrigger value="configure" disabled={!processedData} className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>2. Configure Columns</span>
              </TabsTrigger>
              <TabsTrigger value="preview" disabled={!processedData} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>3. Preview & Generate</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="enter" className="flex-1">
              <EnterDataStep
                pastedData={pastedData}
                setPastedData={setPastedData}
                processedData={processedData}
                isProcessing={isProcessing}
                onTrySampleData={handleTrySampleData}
                onProcessData={handlePasteData}
              />
            </TabsContent>

            <TabsContent value="configure" className="flex-1">
              {processedData && (
                <ConfigureColumnsStep
                  processedData={processedData}
                  validation={validation}
                  onColumnUpdate={handleColumnUpdate}
                  onNext={handleConfigureNext}
                />
              )}
            </TabsContent>

            <TabsContent value="preview" className="flex-1">
              {processedData && (
                <PreviewDataStep
                  processedData={processedData}
                  validation={validation}
                  isGenerating={isGenerating}
                  onGenerateCharts={handleGenerateCharts}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasteDataDialog;
