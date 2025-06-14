
import { useDashboard } from "@/context/DashboardContext";

const DashboardTitle: React.FC = () => {
  const { state, dispatch } = useDashboard();

  return (
    <input
      type="text"
      value={state.title}
      onChange={(e) => dispatch({ type: "SET_TITLE", payload: e.target.value })}
      className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0 text-center w-96"
      placeholder="Untitled Dashboard"
    />
  );
};

export default DashboardTitle;
