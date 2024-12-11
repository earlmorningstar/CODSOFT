import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const WelcomeNote = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleContinueToHomepage = () => {
    navigate("/homepage");
  };

  return (
    <section className="signup-login-Container" id="welcome-note-container">
      {/* <div className="background" id="welcome-page-background"></div> */}
      <span>Hello {user?.name || "there"}, Welcome back to TrendVault.</span>
      <p>
        We're thrilled to have you here. Explore the latest trends, discover
        exclusive deals, and shop your favorites effortlessly.
      </p>

      <p>If you need any assistance, we're just a click away!</p>
      <h2>Happy Shopping!</h2>
      <button className="signup-login-btn" onClick={handleContinueToHomepage}>
        Continue
      </button>
    </section>
  );
};

export default WelcomeNote;
