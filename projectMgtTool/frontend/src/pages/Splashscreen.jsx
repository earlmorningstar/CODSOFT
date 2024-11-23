import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splashscreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const switchPageTimer = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 5000);
    return () => clearTimeout(switchPageTimer);
  }, [navigate]);

  return (
    <div
      className="splashscreen-container"
      style={{
        backgroundColor: "#f0f4f8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "15em 3rem 3rem 3rem",
        textAlign: "center",
        height: "100vh",
        color: "#333",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <h1>Project Management App</h1>
      <h2>Streamline Projects. Boost Productivity.</h2>
    </div>
  );
}

export default Splashscreen;
