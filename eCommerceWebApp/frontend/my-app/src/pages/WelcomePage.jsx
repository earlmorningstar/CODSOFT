import { useNavigate } from "react-router-dom";
import "./Index.css";

const images = [{ src: "/images/trend-vault-logo2.png", alt: "Logo 1" }];

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
      <span
        className="signup-login-image-container"
        id="signup-login-image-container-id"
      >
        <img src={images[0].src} alt={images[0].alt} />
      </span>
      <span>Welcome to TrendVault</span>
      <p>Your one-stop treasure trove for style, tech, and more!</p>

      <div className="wlcm-btn-container">
        <button onClick={handleLoginPage}>Log In</button>
        <button onClick={handleSignupPage}>Sign Up</button>
      </div>
    </section>
  );
};

export default WelcomePage;
