import { createContext, useContext, useReducer, ReactNode } from "react";
import { 
  DashboardState, 
  DashboardAction, 
  DashboardContextType,
  DashboardHistoryState,
  ChartItemType
} from "../types";

const initialState: DashboardState = {
  title: "Untitled Dashboard",
  items: [],
  selectedItemId: null,
  isGridVisible: true,
  gridSize: 20,
  snapToGrid: true,
  editHistory: {
    past: [],
    future: [],
  },
  previewMode: false,
  canvasColor: "#FFFFFF",
};

const MAX_HISTORY_LENGTH = 30;

function saveToHistory(state: DashboardState): DashboardState {
  const historyState: DashboardHistoryState = {
    title: state.title,
    items: [...state.items],
  };
  
  return {
    ...state,
    editHistory: {
      past: [historyState, ...state.editHistory.past].slice(0, MAX_HISTORY_LENGTH),
      future: [],
    }
  };
}

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    case "SET_TITLE":
      return saveToHistory({
        ...state,
        title: action.payload,
      });

    case "ADD_ITEM":
      return saveToHistory({
        ...state,
        items: [...state.items, action.payload],
        selectedItemId: action.payload.id,
      });

    case "UPDATE_ITEM":
      return saveToHistory({
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      });

    case "REMOVE_ITEM":
      return saveToHistory({
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        selectedItemId: state.selectedItemId === action.payload ? null : state.selectedItemId,
      });

    case "CLEAR_ALL_ITEMS":
      return saveToHistory({
        ...state,
        items: [],
        selectedItemId: null,
      });

    case "SELECT_ITEM":
      return {
        ...state,
        selectedItemId: action.payload,
      };

    case "MOVE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, position: action.payload.position }
            : item
        ),
      };

    case "RESIZE_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, size: action.payload.size }
            : item
        ),
      };

    case "TOGGLE_GRID":
      return {
        ...state,
        isGridVisible: action.payload !== undefined ? action.payload : !state.isGridVisible,
      };

    case "SET_GRID_SIZE":
      return {
        ...state,
        gridSize: action.payload,
      };

    case "TOGGLE_SNAP_TO_GRID":
      return {
        ...state,
        snapToGrid: action.payload !== undefined ? action.payload : !state.snapToGrid,
      };

    case "UNDO":
      if (state.editHistory.past.length === 0) return state;
      
      const previous = state.editHistory.past[0];
      const newPast = state.editHistory.past.slice(1);
      
      const currentState: DashboardHistoryState = {
        title: state.title,
        items: [...state.items],
      };
      
      return {
        ...state,
        title: previous.title,
        items: previous.items,
        editHistory: {
          past: newPast,
          future: [currentState, ...state.editHistory.future],
        },
      };

    case "REDO":
      if (state.editHistory.future.length === 0) return state;
      
      const next = state.editHistory.future[0];
      const newFuture = state.editHistory.future.slice(1);
      
      const currentState2: DashboardHistoryState = {
        title: state.title,
        items: [...state.items],
      };
      
      return {
        ...state,
        title: next.title,
        items: next.items,
        editHistory: {
          past: [currentState2, ...state.editHistory.past],
          future: newFuture,
        },
      };

    case "TOGGLE_PREVIEW_MODE":
      return {
        ...state,
        previewMode: action.payload !== undefined ? action.payload : !state.previewMode,
        selectedItemId: null,
      };

    case "SET_CANVAS_COLOR":
      return {
        ...state,
        canvasColor: action.payload,
      };

    case "IMPORT_DASHBOARD":
      return {
        ...action.payload,
        editHistory: {
          past: [],
          future: [],
        },
      };

    default:
      return state;
  }
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
