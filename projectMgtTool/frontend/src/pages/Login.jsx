import React, { useState, useContext } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import "./Index.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/users/login", { email, password });
      login(data);
      localStorage.setItem("user", JSON.stringify(data));
      setSuccess("Login Successful!");
      setTimeout(() => {
        setSuccess("");
        navigate("/dashboard", { replace: true });
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login Failed, please try again."
      );
      setTimeout(() => setError(""), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-login-mainContainer">
      <Box sx={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
        <Typography
          className="signup-login-typography-holder"
          variant="h4"
          gutterBottom
        >
          Login to continue
        </Typography>
        <form onSubmit={handleSubmit}>
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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {error && (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert severity="error">{error}</Alert>
              </Stack>
            )}
            {success && (
              <Stack sx={{ width: "100%" }} spacing={2}>
                <Alert severity="success">{success}</Alert>
              </Stack>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </form>
        {/* <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop> */}
        <Typography
          className="signup-login-switchLink"
          variant="body2"
          sx={{ marginTop: 2 }}
        >
          New? Let’s{" "}
          <NavLink className="signup-login-navlink" to="/signup">
            Sign Up
          </NavLink>
        </Typography>
      </Box>
    </div>
  );
};

export default Login;
