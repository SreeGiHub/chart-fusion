
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
  snapToGrid: true,
  editHistory: {
    past: [],
    future: []
  },
  previewMode: false,
  canvasColor: '#F0F0F0',
};

const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  const saveToHistory = (currentState: DashboardState) => ({
    title: currentState.title,
    items: currentState.items
  });

  switch (action.type) {
    case "SET_TITLE":
      return { 
        ...state, 
        title: action.payload,
        editHistory: {
          past: [...state.editHistory.past, saveToHistory(state)].slice(-50),
          future: []
        }
      };
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
        editHistory: {
          past: [...state.editHistory.past, saveToHistory(state)].slice(-50),
          future: []
        }
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, ...action.payload.updates } : item
        ),
        editHistory: {
          past: [...state.editHistory.past, saveToHistory(state)].slice(-50),
          future: []
        }
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        selectedItemId: state.selectedItemId === action.payload ? null : state.selectedItemId,
        editHistory: {
          past: [...state.editHistory.past, saveToHistory(state)].slice(-50),
          future: []
        }
      };
    case "CLEAR_ALL_ITEMS":
      return {
        ...state,
        items: [],
        selectedItemId: null,
        editHistory: {
          past: [...state.editHistory.past, saveToHistory(state)].slice(-50),
          future: []
        }
      };
    case "SELECT_ITEM":
      return { ...state, selectedItemId: action.payload };
    case "MOVE_ITEM":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, position: action.payload.position } : item
        ),
        editHistory: {
          past: [...state.editHistory.past, saveToHistory(state)].slice(-50),
          future: []
        }
      };
    case "RESIZE_ITEM":
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, size: action.payload.size } : item
        ),
        editHistory: {
          past: [...state.editHistory.past, saveToHistory(state)].slice(-50),
          future: []
        }
      };
    case "TOGGLE_GRID":
      return { ...state, isGridVisible: action.payload !== undefined ? action.payload : !state.isGridVisible };
    case "SET_GRID_SIZE":
      return { ...state, gridSize: action.payload };
    case "TOGGLE_SNAP_TO_GRID":
      return { ...state, snapToGrid: action.payload !== undefined ? action.payload : !state.snapToGrid };
    case "UNDO":
      if (state.editHistory.past.length > 0) {
        const previous = state.editHistory.past[state.editHistory.past.length - 1];
        const newPast = state.editHistory.past.slice(0, -1);
        return {
          ...state,
          ...previous,
          editHistory: {
            past: newPast,
            future: [saveToHistory(state), ...state.editHistory.future]
          }
        };
      }
      return state;
    case "REDO":
      if (state.editHistory.future.length > 0) {
        const next = state.editHistory.future[0];
        const newFuture = state.editHistory.future.slice(1);
        return {
          ...state,
          ...next,
          editHistory: {
            past: [...state.editHistory.past, saveToHistory(state)],
            future: newFuture
          }
        };
      }
      return state;
    case "TOGGLE_PREVIEW_MODE":
      return { ...state, previewMode: action.payload !== undefined ? action.payload : !state.previewMode };
    case "SET_CANVAS_COLOR":
      return { ...state, canvasColor: action.payload };
    case "IMPORT_DASHBOARD":
      return {
        ...state,
        ...action.payload,
        editHistory: {
          past: [...state.editHistory.past, saveToHistory(state)].slice(-50),
          future: []
        }
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
