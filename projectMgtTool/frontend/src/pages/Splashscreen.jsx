import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splashscreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const switchPageTimer = setTimeout(() => {
      navigate("/login");
    }, 5000);
    return () => clearTimeout(switchPageTimer);
  }, [navigate]);

  return (
    <div className="splashscreen-container">
      <h1>Project Management App</h1>
      <h2>Streamline Projects. Boost Productivity.</h2>
    </div>
  );
}

export default Splashscreen;
