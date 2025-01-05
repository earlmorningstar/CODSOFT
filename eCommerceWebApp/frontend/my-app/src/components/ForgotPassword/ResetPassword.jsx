import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";
import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  Input,
  InputAdornment,
  IconButton,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const images = [{ src: "/images/trend-vault-logo2.png", alt: "Logo 1" }];

const ResetPassword = () => {
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email, token } = location.state || {};

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const validatePasswordForm = () => {
    if (passwordData.password && passwordData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (passwordData.password && !/[A-Z]/.test(passwordData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (passwordData.password === "Password") {
      setError("Password cannot be 'Password'");
      return false;
    }
    if (passwordData.password !== passwordData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      const response = await api.post("/api/users/reset-password", {
        email,
        token,
        newPassword: passwordData.password,
      });

      setSuccess(response.data.message);
      setPasswordData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
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
            Reset Password
          </span>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl variant="standard">
                <InputLabel htmlFor="password">
                  New Password <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Input
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                />
              </FormControl>
              <FormControl variant="standard">
                <InputLabel htmlFor="password">
                  Confirm New Password <span style={{ color: "red" }}>*</span>
                </InputLabel>
                <Input
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  required
                />
              </FormControl>
              <button type="submit" className="signup-login-btn">
                {loading ? (
                  <CircularProgress size={14} color="inherit" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </Box>
          </form>
        </Box>
      </section>
    </>
  );
};

export default ResetPassword;
