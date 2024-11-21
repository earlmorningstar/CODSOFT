import React, { useState } from "react";
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
import api from "../utils/api";
import { NavLink, useNavigate } from "react-router-dom";
import "./Index.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const validateForm = () => {
    if (!name.trim()) {
      setError("Name cannot be blank");
      return false;
    }
    if (!email.trim()) {
      setError("Email cannot be blank");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email must be formatted correctly");
      return false;
    }
    if (!password) {
      setError("Password cannot be blank");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (password === "Password") {
      setError("Password cannot be 'Password'");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await api.post("/users/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      setSuccess("Registration successful. Please login.");
      setTimeout(() => {
        setSuccess("");
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
      setTimeout(() => setError(""), 3000);
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
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={
                <div className="auth-label-flex">
                  Name <span style={{ color: "red" }}>*</span>
                </div>
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              multiline
              maxRows={4}
              variant="standard"
            />
            <TextField
              label={
                <div className="auth-label-flex">
                  Email Address <span style={{ color: "red" }}>*</span>
                </div>
              }
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              multiline
              maxRows={4}
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
            <FormControl variant="standard">
              <InputLabel htmlFor="confirm-password">
                Confirm Password <span style={{ color: "red" }}>*</span>
              </InputLabel>
              <Input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

            <Stack sx={{ width: "100%" }} spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
            </Stack>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign up"
              )}
            </Button>
          </Box>
        </form>
        <Typography
          className="signup-login-switchLink"
          variant="body2"
          sx={{ marginTop: 2 }}
        >
          Already have an account?{" "}
          <NavLink className="signup-login-navlink" to="/login">
            Log In
          </NavLink>
        </Typography>

        {/* <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
      </Box>
    </div>
  );
};

export default Signup;
