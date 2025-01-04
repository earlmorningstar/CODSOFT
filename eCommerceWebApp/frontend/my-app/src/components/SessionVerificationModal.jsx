import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Alert,
  Modal,
  Box,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import api from "../utils/api";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  width: 300,
};

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
      const response = await api.post("/api/users/verify-session", {
        email: user.email,
        password: password.trim(),
      });
      const userData = response.data.data;
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);

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
      <Box sx={modalStyle}>
        <span className="verify-password-title">
          <h2 className="delete-modal-title">Session Verification</h2>
          <Typography
            className="delete-modal-title"
            style={{
              marginBottom: "16px",
              marginTop: "16px",
              fontSize: "18px",
            }}
          >
            You've been inactive for a while, input your password to continue
          </Typography>
        </span>

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

        <span className="cart-modal-del-btnHolder">
          <button
            className="cart-modal-button"
            onClick={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={18} /> : "Verify"}
          </button>
          <button
            className="cart-modal-button"
            onClick={handleLogout}
            disabled={isLoading}
          >
            Logout Instead
          </button>
        </span>
      </Box>
    </Modal>
  );
};

export default SessionVerificationModal;
