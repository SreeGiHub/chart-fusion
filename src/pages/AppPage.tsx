
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AppPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main dashboard application
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading dashboard builder...</p>
    </div>
  );
};

export default AppPage;
