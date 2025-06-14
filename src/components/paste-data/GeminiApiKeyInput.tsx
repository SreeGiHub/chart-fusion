
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain,
  ExternalLink,
  Eye,
  EyeOff,
  Info
} from "lucide-react";

interface GeminiApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
  showKey: boolean;
  setShowKey: (show: boolean) => void;
}

const GeminiApiKeyInput: React.FC<GeminiApiKeyInputProps> = ({
  apiKey,
  setApiKey,
  showKey,
  setShowKey,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor="gemini-key" className="flex items-center gap-2 text-sm font-medium">
          <Brain className="h-4 w-4 text-blue-500" />
          Gemini AI API Key (Optional)
        </Label>
        <Button
          variant="link"
          size="sm"
          className="text-xs h-auto p-0"
          onClick={() => window.open('https://aistudio.google.com/app/apikey', '_blank')}
        >
          Get free API key <ExternalLink className="h-3 w-3 ml-1" />
        </Button>
      </div>
      
      <div className="relative">
        <Input
          id="gemini-key"
          type={showKey ? "text" : "password"}
          placeholder="Enter your Gemini API key for AI-powered chart suggestions"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <strong>AI Enhancement:</strong> With a Gemini API key, our system will analyze your data context and suggest the most relevant chart types and layouts. Without it, we'll use smart rule-based suggestions.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GeminiApiKeyInput;
