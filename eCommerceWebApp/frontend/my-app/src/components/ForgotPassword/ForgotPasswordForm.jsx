import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import {
  TextField,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";

const images = [{ src: "/images/trend-vault-logo2.png", alt: "Logo 1" }];

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/users/forgot-password", { email });
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate("/verify-reset-code", { state: { email } });
      }, 2500);
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occured. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowError(false);
    setError("");
  };

  useEffect(() => {
    if (success) {
      setShowSuccess(true);
    }
  }, [success]);

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSuccess(false);
    setSuccess("");
  };

  return (
    <>
      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {error && <Alert severity="error">{error}</Alert>}
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {success && <Alert severity="success">{success}</Alert>}
      </Snackbar>

      <section className="signup-login-Container">
        <span className="signup-login-image-container">
          <img src={images[0].src} alt={images[0].alt} />
        </span>

        <Box sx={{ maxWidth: "400px", marginTop: "3.5rem", padding: "1rem" }}>
          <span className="signup-login-typography-container">
            Find Your Account
          </span>

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
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  "Send Reset Code"
                )}
              </button>
            </Box>
          </form>
        </Box>
      </section>
    </>
  );
};

export default ForgotPasswordForm;