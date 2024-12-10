import { useNavigate } from "react-router-dom";
import "./Index.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleLoginPage = () => {
    navigate("/login");
  };

  const handleSignupPage = () => {
    navigate("/signup");
  };

  return (
    <section className="welcome-page">
      <div className="background"></div>
      <span>Welcome to TrendVault</span>
      <p>Your one-stop treasure trove for style, tech, and more!</p>

      <div className="wlcm-btn-container">
        <button onClick={handleLoginPage}>
          Log In
        </button>
        <button onClick={handleSignupPage}>
          Sign Up
        </button>
      </div>
    </section>
  );
};

export default WelcomePage;
