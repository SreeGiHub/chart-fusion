
import { useDashboard } from "@/context/DashboardContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const CANVAS_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Light Gray", value: "#F8F9FA" },
  { name: "Dark Gray", value: "#E9ECEF" },
  { name: "Light Blue", value: "#E3F2FD" },
  { name: "Light Green", value: "#E8F5E8" },
  { name: "Light Yellow", value: "#FFF9E6" },
  { name: "Light Pink", value: "#FDE2E7" },
  { name: "Light Purple", value: "#F3E8FF" },
  { name: "Cream", value: "#FDF6E3" },
  { name: "Mint", value: "#F0FDFA" },
];

const CanvasColorPicker: React.FC = () => {
  const { state, dispatch } = useDashboard();

  const handleCanvasColorChange = (color: string) => {
    dispatch({ type: "SET_CANVAS_COLOR", payload: color });
    toast.success("Canvas color updated");
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <div 
            className="w-4 h-4 rounded border"
            style={{ backgroundColor: state.canvasColor || "#FFFFFF" }}
          />
          <span>Canvas</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Canvas Background Color</h4>
          <div className="grid grid-cols-6 gap-2">
            {CANVAS_COLORS.map((color) => (
              <button
                key={color.value}
                className={`w-8 h-8 rounded border-2 hover:scale-110 transition-transform ${
                  state.canvasColor === color.value 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => handleCanvasColorChange(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CanvasColorPicker;
