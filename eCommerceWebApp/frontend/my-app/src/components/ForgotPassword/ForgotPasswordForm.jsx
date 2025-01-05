import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { TextField, Box, CircularProgress, Alert } from "@mui/material";

const images = [{ src: "/images/trend-vault-logo2.png", alt: "Logo 1" }];

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/users/forgot-password", { email });
      setSuccess(response.data.message);
      navigate("/verify-reset-code", { state: { email } });
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occured. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="signup-login-Container">
        <span className="signup-login-image-container">
          <img src={images[0].src} alt={images[0].alt} />
        </span>
        
      <Box sx={{ maxWidth: "400px", marginTop: "3.5rem", padding: "1rem" }}>
        <span className="signup-login-typography-container">
          Forgot Password
        </span>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label={
                <div className="auth-label-flex">
                  Email Address <span style={{ color: "red" }}>*</span>
                </div>
              }
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="standard"
              sx={{ marginTop: "10px" }}
            />
            <button className="signup-login-btn" type="submit">
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Send Reset Code"
              )}
            </button>
          </Box>
        </form>
      </Box>
    </section>
  );
};

export default ForgotPasswordForm;
