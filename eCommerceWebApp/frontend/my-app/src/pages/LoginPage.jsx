import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Typography,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const images = [{ src: "/images/trend-vault-logo2.png", alt: "Logo 1" }];

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/users/login", { email, password });

      const { _id, name, email: userEmail, token } = response.data.data;

      const user = { _id, name, email: userEmail, token };

      localStorage.setItem("user", JSON.stringify(user));
      login(user);
      setSuccess("Login Successful");
      setTimeout(() => {
        setSuccess("");
        navigate("/welcome-note-page", { replace: true });
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed, please try again."
      );
      setTimeout(() => setError(""), 2000);
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
    <section className="signup-login-Container">
      <span className="signup-login-image-container">
        <img src={images[0].src} alt={images[0].alt} />
      </span>
      <Box sx={{ maxWidth: "400px", marginTop: "3.5rem", padding: "1rem" }}>
        <span className="signup-login-typography-container">
          Log into your account
        </span>

        <form onSubmit={handleLogin}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={
                <div className="auth-label-flex">
                  Email Address <span style={{ color: "red" }}>*</span>
                </div>
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="standard"
            />
            <FormControl variant="standard">
              <InputLabel htmlFor="password">
                Password <span style={{ color: "red" }}>*</span>
              </InputLabel>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <Snackbar
              open={showError}
              autoHideDuration={5000}
              onClose={handleCloseError}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Stack sx={{ width: "100%" }} spacing={2}>
                {error && <Alert severity="error">{error}</Alert>}
              </Stack>
            </Snackbar>

            <Snackbar
              open={showSuccess}
              autoHideDuration={5000}
              onClose={handleCloseSuccess}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Stack sx={{ width: "100%" }} spacing={2}>
                {success && <Alert severity="success">{success}</Alert>}
              </Stack>
            </Snackbar>

            <button className="signup-login-btn" type="submit">
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Log in"
              )}
            </button>
          </Box>
        </form>
        <Typography
          className="signup-login-switchLink"
          variant="body2"
          sx={{ marginTop: 2 }}
        >
          Don't have an account?{" "}
          <NavLink className="signup-login-navlink" to="/signup">
            Join Us
          </NavLink>
        </Typography>
      </Box>
    </section>
  );
};

export default LoginPage;
