import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../utils/api";
import { TextField, Box, CircularProgress, Alert } from "@mui/material";

const images = [{ src: "/images/trend-vault-logo2.png", alt: "Logo 1" }];

const VerifyResetCode = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/users/verify-reset-token", { email, token: code });
      navigate("/reset-password", { state: { email, token: code } });
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
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
          Enter Reset Code
        </span>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label={
                <div className="auth-label-flex">
                  Reset Codes <span style={{ color: "red" }}>*</span>
                </div>
              }
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              variant="standard"
              sx={{ marginTop: "10px" }}
              inputProps={{ maxLength: 6 }}
            />

            <button type="submit" className="signup-login-btn">
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Verify Code"
              )}
            </button>
          </Box>
        </form>
      </Box>
    </section>
  );
};

export default VerifyResetCode;
