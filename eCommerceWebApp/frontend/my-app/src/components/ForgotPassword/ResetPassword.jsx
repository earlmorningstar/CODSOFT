import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";
import { TextField, Box, CircularProgress, Alert } from "@mui/material";

const images = [{ src: "/images/trend-vault-logo2.png", alt: "Logo 1" }];

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, token } = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (newPassword !== confirmPassword) {
      setError("Passwords must match to continue.");
      return;
    }

    try {
      await api.post("/api/users/reset-password", {
        email,
        token,
        newPassword,
      });
      navigate("/login");
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
          Reset Password
        </span>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={
                <div className="auth-label-flex">
                  New Password <span style={{ color: "red" }}>*</span>
                </div>
              }
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              variant="standard"
            />

            <TextField
              label={
                <div className="auth-label-flex">
                  Confirm Password <span style={{ color: "red" }}>*</span>
                </div>
              }
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              variant="standard"
            />

            <button type="submit" className="signup-login-btn">
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Reset Password"
              )}
            </button>
          </Box>
        </form>
      </Box>
    </section>
  );
};

export default ResetPassword;
