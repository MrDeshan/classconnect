import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Video, Mic, Volume2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface SettingsPanelProps {
  onClose: () => void;
}

const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  return (
    <Card className="glass-card fixed right-4 top-4 w-80 p-4 flex flex-col bg-gray-900/90 border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white">Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Video className="w-4 h-4" /> Camera
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select camera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webcam">Webcam</SelectItem>
              <SelectItem value="external">External Camera</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Mic className="w-4 h-4" /> Microphone
          </Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select microphone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Internal Mic</SelectItem>
              <SelectItem value="external">External Mic</SelectItem>
              <SelectItem value="headset">Headset Mic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" /> Speaker Volume
          </Label>
          <Slider
            defaultValue={[75]}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </Card>
  );
};

export default SettingsPanel;