import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WelcomeNote = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name);
    }
  }, []);

  const handleContinueToHomepage = () => {
    navigate("/homepage");
  };

  return (
    <section className="signup-login-Container" id="welcome-note-container">
        {/* <div className="background" id="welcome-page-background"></div> */}
      <span>
        Hello {userName ? userName : "there"}, Welcome back to TrendVault.
      </span>
      <p>
        We're thrilled to have you here. Explore the latest trends, discover
        exclusive deals, and shop your favorites effortlessly.
      </p>

      <p>If you need any assistance, we're just a click away!</p>
      <h2>Happy Shopping!</h2>
      <button className="signup-login-btn" onClick={handleContinueToHomepage}>Continue</button>
    </section>
  );
};

export default WelcomeNote;
