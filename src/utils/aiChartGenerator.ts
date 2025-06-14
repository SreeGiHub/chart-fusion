
// Re-export all functionality from the modular AI chart utilities
export type { AIChartSuggestion } from "./ai/types";
export { generateAIChartSuggestions } from "./ai/suggestions";
export { createAIChartsFromData } from "./ai/chartCreation";
export { generateFallbackSuggestions } from "./ai/fallbackSuggestions";
