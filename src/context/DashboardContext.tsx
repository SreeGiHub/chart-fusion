import React, { createContext, useContext, useReducer } from "react";
import { ChartItemType, DashboardAction, DashboardState, Position, Size } from "@/types";
import { v4 as uuidv4 } from 'uuid';

interface DashboardContextProps {
  state: DashboardState;
  dispatch: React.Dispatch<DashboardAction>;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(
  undefined
);

const initialState: DashboardState = {
  title: "My Dashboard",
  items: [],
  selectedItemId: null,
  isGridVisible: true,
  gridSize: 20,
  isSnapToGrid: true,
  history: [],
  historyIndex: -1,
  isPreviewMode: false,
  canvasColor: '#F0F0F0',
};

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
        history: [...state.history, { ...state }].slice(-50),
        historyIndex: Math.min(state.historyIndex + 1, 49)
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        ),
        history: [...state.history, { ...state }].slice(-50),
        historyIndex: Math.min(state.historyIndex + 1, 49)
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        selectedItemId: state.selectedItemId === action.payload ? null : state.selectedItemId,
        history: [...state.history, { ...state }].slice(-50),
        historyIndex: Math.min(state.historyIndex + 1, 49)
      };
    case "CLEAR_ALL_ITEMS":
      return {
        ...state,
        items: [],
        selectedItemId: null,
        history: [...state.history, { ...state }].slice(-50),
        historyIndex: Math.min(state.historyIndex + 1, 49)
      };
    case "SELECT_ITEM":
      return { ...state, selectedItemId: action.payload };
    case "MOVE_ITEM":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, position: action.payload.position } : item
        ),
        history: [...state.history, { ...state }].slice(-50),
        historyIndex: Math.min(state.historyIndex + 1, 49)
      };
    case "RESIZE_ITEM":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, size: action.payload.size } : item
        ),
        history: [...state.history, { ...state }].slice(-50),
        historyIndex: Math.min(state.historyIndex + 1, 49)
      };
    case "TOGGLE_GRID":
      return { ...state, isGridVisible: !state.isGridVisible };
    case "SET_GRID_SIZE":
      return { ...state, gridSize: action.payload };
    case "TOGGLE_SNAP_TO_GRID":
      return { ...state, isSnapToGrid: !state.isSnapToGrid };
    case "UNDO":
      if (state.historyIndex > 0) {
        return { ...state.history[state.historyIndex - 1], historyIndex: state.historyIndex - 1 };
      }
      return state;
    case "REDO":
      if (state.historyIndex < state.history.length - 1) {
        return { ...state.history[state.historyIndex + 1], historyIndex: state.historyIndex + 1 };
      }
      return state;
    case "TOGGLE_PREVIEW_MODE":
      return { ...state, isPreviewMode: !state.isPreviewMode };
    case "SET_CANVAS_COLOR":
      return { ...state, canvasColor: action.payload };
    case "IMPORT_DASHBOARD":
      return {
        ...state,
        ...action.payload,
        history: [...state.history, { ...state }].slice(-50),
        historyIndex: Math.min(state.historyIndex + 1, 49)
      };
    default:
      return state;
  }
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
