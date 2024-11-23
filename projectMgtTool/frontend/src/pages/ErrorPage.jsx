import { useNavigate } from "react-router-dom";
import "./Index.css";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="dash-main-container">
      <span className="error-main-container">
        <h1>An error occured!!</h1>
        <p>Could not find this page.</p>
        <button onClick={handleDashboard} className="proj-btn">
          Dashboard
        </button>
      </span>
    </div>
  );
};

export default ErrorPage;
