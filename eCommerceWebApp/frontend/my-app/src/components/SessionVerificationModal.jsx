import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Alert,
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";

const SessionVerificationModal = ({ open, onClose }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleVerify = async () => {
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/verify-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            password: password.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed. Please try again.");
      }

      localStorage.setItem("user", JSON.stringify(data));
      login(data);

      setPassword("");
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || "Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <Modal
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          onClose();
        }
      }}
      disableEscapeKeyDown
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" mb={2} textAlign="center">
          Session Verification
        </Typography>
        <Typography mb={3} textAlign="center">
          You've been inactive for a while, input your password to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleVerify()}
          disabled={isLoading}
          sx={{ mb: 3 }}
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="contained" onClick={handleVerify} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : "Verify"}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            disabled={isLoading}
          >
            Logout Instead
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SessionVerificationModal;