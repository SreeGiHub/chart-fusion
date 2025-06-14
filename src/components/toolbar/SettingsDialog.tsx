
import { useDashboard } from "@/context/DashboardContext";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const SettingsDialog: React.FC = () => {
  const { state, dispatch } = useDashboard();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
          <DialogDescription>
            Configure the dashboard appearance and behavior
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-grid">Show Grid</Label>
            <Switch
              id="show-grid"
              checked={state.isGridVisible}
              onCheckedChange={() => dispatch({ type: "TOGGLE_GRID" })}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="snap-grid">Snap to Grid</Label>
            <Switch
              id="snap-grid"
              checked={state.snapToGrid}
              onCheckedChange={() => dispatch({ type: "TOGGLE_SNAP_TO_GRID" })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="grid-size">Grid Size: {state.gridSize}px</Label>
            <Slider
              id="grid-size"
              defaultValue={[state.gridSize]}
              min={10}
              max={50}
              step={5}
              onValueChange={(value) => dispatch({ type: "SET_GRID_SIZE", payload: value[0] })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
