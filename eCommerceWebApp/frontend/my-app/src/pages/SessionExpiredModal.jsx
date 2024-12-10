import { Modal, Box, Typography, Button } from "@mui/material";

const SessionExpiredModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="session-expired">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography id="session-expired" variant="h6" mb={2}>
          Info
        </Typography>
        <Typography mb={3}>
          Your session has timed out. Please log in again to continue.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            onClose();
            window.location.href = "/login";
          }}
        >
          Ok
        </Button>
      </Box>
    </Modal>
  );
};

export default SessionExpiredModal;
