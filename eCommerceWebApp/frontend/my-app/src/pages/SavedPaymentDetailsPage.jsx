import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../utils/api";
import {
  Alert,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  IconButton,
  Modal,
  Box,
  TextField,
  Button,
  Stack,
  Snackbar,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IoChevronBackOutline } from "react-icons/io5";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  width: 320,
  borderRadius: 2,
};

const SavedPaymentDetailsPage = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [success, setSuccess] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchCardDetails();
  }, []);

  const fetchCardDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/users/cards/card-details");
      if (response.data && response.data.data) {
        setCardDetails(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch card details:", error);
      setError("Failed to load card details");
      setTimeout(() => {
        setError("");
      }, 4000);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (title, message, type) => {
    try {
      await api.post("/api/notifications", {
        title,
        message,
        type,
      });
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  };

  const handlePasswordVerification = async () => {
    try {
      const response = await api.post("/api/users/cards/verify-password", {
        password,
      });
      if (response.data.success) {
        setShowDetails((prev) => ({
          ...prev,
          [currentCardIndex]: true,
        }));
        setIsModalOpen(false);
        setPassword("");
      }
    } catch (error) {
      setError("Incorrect password. Please try again.");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleShowDetails = (index) => {
    if (!showDetails[index]) {
      setCurrentCardIndex(index);
      setIsModalOpen(true);
    } else {
      setShowDetails((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleDeleteCard = async () => {
    if (!selectedCardId) {
      console.error("No card selected for deletion");
      setError("Unable to delete card. No card selected");
      setTimeout(() => {
        setError("");
      }, 4000);
      return;
    }

    const cardToDelete = cardDetails.find(
      (card) => card._id === selectedCardId
    );
    if (!cardToDelete) {
      setError("Card not found");
      return;
    }

    try {
      const response = await api.delete(`/api/users/cards/${selectedCardId}`);

      if (response.data && response.data.success) {
        setCardDetails((prevCards) =>
          prevCards.filter((card) => card._id !== selectedCardId)
        );
        setIsDeleteModalOpen(false);
        setSelectedCardId(null);
        setSuccess("Card successfully removed.");
        await createNotification(
          "Card Removed Successfully!",
          `Your card ending in ****${cardToDelete.last4} has been removed from your account. It will no longer be available for transactions on this app.`,
          "info"
        );
        setTimeout(() => {
          setSuccess("");
        }, 4000);
      } else {
        throw new Error("Failed to delete card");
      }
    } catch (error) {
      console.error("Failed to delete card:", error);
      setError("Failed to remove card. Please try again");
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };

  const handleClose = () => {
    setLoading(false);
  };
  const handleOpen = () => {
    setLoading(true);
  };

  const openDeleteModal = (cardId) => {
    if (!cardId) {
      console.error("No card Id provided");
      return;
    }
    setSelectedCardId(cardId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
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

  if (loading) {
    return (
      <div onClick={handleOpen}>
        <Backdrop
          sx={(theme) => ({
            color: "#6055d8",
            zIndex: theme.zIndex.drawer + 1,
          })}
          open={loading}
          onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
  }

  return (
    <section className="userPages-main-container">
      <div className="usermenuPages-title-container">
        <NavLink to="/user-menu">
          <span>
            <IoChevronBackOutline size={25} />
          </span>
        </NavLink>
      </div>

      <p className="usermenuPages-title-textCenter">
        Saved Payment Card Details
      </p>

      <Snackbar
        open={showError}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Stack sx={{ width: "100%" }} spacing={2}>
          {error && (
            <Alert
              className="alert-message-holder"
              id="alert-message-savedCard-id"
              severity="error"
            >
              {error}
            </Alert>
          )}
        </Stack>
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {success && (
          <Alert
            className="alert-message-holder"
            id="alert-message-savedCard-id"
            severity="success"
          >
            {success}
          </Alert>
        )}
      </Snackbar>

      <div>
        {cardDetails && cardDetails.length > 0 ? (
          cardDetails.map((card, index) => (
            <div key={card._id} className="savedCard-details-container">
              <FormControl sx={{ m: 1, maxWidth: "400px" }} variant="standard">
                <InputLabel>Card Number</InputLabel>
                <Input
                  value={
                    showDetails[index] ? `****${card.last4}` : "************"
                  }
                  readOnly
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => handleShowDetails(index)}>
                        {showDetails[index] ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl sx={{ m: 1, maxWidth: "400px" }} variant="standard">
                <InputLabel>Expiry Date</InputLabel>
                <Input
                  value={
                    showDetails[index]
                      ? `${card.expMonth}/${card.expYear}`
                      : "**/**"
                  }
                  readOnly
                />
              </FormControl>
              <button
                className="savedCard-removeBtn"
                onClick={() => openDeleteModal(card._id)}
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="verify-password-title">
            <p>No saved card details found.</p>
          </div>
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box sx={modalStyle}>
          <div className="modal-width">
            <span className="verify-password-title">
              <h2>Verify Password</h2>
            </span>
            <TextField
              type="password"
              label="Enter your password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
            />
            {error && (
              <p style={{ color: "red" }} className="error-message">
                {error}
              </p>
            )}
            <Button
              variant="contained"
              onClick={handlePasswordVerification}
              sx={{ mt: 2 }}
            >
              Verify
            </Button>
          </div>
        </Box>
      </Modal>

      <Modal open={isDeleteModalOpen} onClose={closeDeleteModal}>
        <Box sx={modalStyle}>
          <span className="verify-password-title">
            <h2>Remove Saved Card</h2>
            <p>This action will remove this saved card. Are you sure?</p>
          </span>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteCard}
            sx={{ mr: 2 }}
          >
            Okay
          </Button>
          <Button variant="outlined" onClick={closeDeleteModal}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </section>
  );
};

export default SavedPaymentDetailsPage;
