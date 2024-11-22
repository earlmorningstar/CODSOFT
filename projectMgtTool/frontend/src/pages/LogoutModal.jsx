import { useState } from "react";
import {
  Modal,
  Button,
  Box,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";

const LogoutModal = ({ onLogout }) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => {
    if (!isLoggingOut) setShowModal(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
      setShowModal(false);
    }
  };

  return (
    <div>
      <button className="proj-btn" id="logoutBtn" onClick={handleOpen}>
        Logout
      </button>

      <Modal
        open={showModal}
        onClose={handleClose}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography id="logout-modal-title" variant="h6">
            Do you want to logout?
          </Typography>
          <Box mt={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleClose}
              disabled={isLoggingOut}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              Logout
            </Button>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
              open={isLoggingOut}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default LogoutModal;
