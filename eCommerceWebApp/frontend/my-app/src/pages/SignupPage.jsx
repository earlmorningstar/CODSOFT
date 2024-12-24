import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../utils/api";
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
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import CountrySelect from "./CountrySelect";

const images = [{ src: "/images/trend-vault-logo2.png", alt: "Logo 1" }];

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (!password.trim()) {
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
    if (!age) {
      setError("Age is required");
      return false;
    }
    if (age < 18) {
      setError("Person under the age of 18 cannot be registered");
      return false;
    }
    if (!country) {
      setError("Please, select your country of residence");
      return false;
    }
    return true;
  };

  const handleSubmitSignupForm = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await api.post("/api/users/register", {
        name,
        email,
        age,
        country,
        deliveryAddress,
        password,
        confirmPassword,
      });
      console.log("Response", data);
      setSuccess("Registration Successful. Now login");
      setTimeout(() => {
        setSuccess("");
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || " Registration failed. Please try again."
      );
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="signup-login-Container">
      <span className="signup-login-image-container">
        <img src={images[0].src} alt={images[0].alt} />
      </span>
      <Box sx={{ maxWidth: "400px", marginTop: "3rem", padding: "1rem" }}>
        <span className="signup-login-typography-container">
          Create your account
        </span>

        <form onSubmit={handleSubmitSignupForm}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label={
                <div className="auth-label-flex">
                  Full Name <span style={{ color: "red" }}>*</span>
                </div>
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              variant="standard"
            />
            <TextField
              label={
                <div className="auth-label-flex">
                  Age <span style={{ color: "red" }}>*</span>
                </div>
              }
              value={age}
              onChange={(e) => setAge(e.target.value)}
              variant="standard"
            />
            <CountrySelect
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <TextField
              label={
                <div className="auth-label-flex">
                  Delivery Address (Optional)
                </div>
              }
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              variant="standard"
            />
            <FormControl variant="standard">
              <InputLabel htmlFor="confirm-password">
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
            <FormControl variant="standard">
              <InputLabel htmlFor="confirm-password">
                Confirm Password <span style={{ color: "red" }}>*</span>
              </InputLabel>
              <Input
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            <Stack sx={{ width: "100%" }} spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}
            </Stack>

            <button
              className="signup-login-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign up"
              )}
            </button>
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
      </Box>
    </section>
  );
};

export default SignupPage;
