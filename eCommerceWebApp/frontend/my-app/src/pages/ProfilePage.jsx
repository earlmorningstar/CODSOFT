import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { IoChevronBackOutline } from "react-icons/io5";
import {
  TextField,
  Button,
  Badge,
  styled,
  Stack,
  Avatar,
  Alert,
  // Backdrop,
  Snackbar,
  CircularProgress,
  Modal,
  Box,
  Typography,
} from "@mui/material";

const images = [{ src: "/images/avatar1.jpg", alt: "Avatar 1" }];

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

const ProfilePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    country: "",
    deliveryAddress: "",
    createdAt: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password && !/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    if (formData.password === "Password") {
      setError("Password cannot be 'Password'");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Email must be formatted correctly");
      return false;
    }
    return true;
  };

  const createNotification = async (title, message, type) => {
    try {
     const response = await api.post("/api/notifications", {
        title,
        message,
        type,
      });
      console.log("Notification creation response:", response.data)
      return response.data;
    } catch (error) {
      console.error("Full error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/users/profile");
      const userData = response.data;
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
        age: userData.age || "",
        country: userData.country || "",
        deliveryAddress: userData.deliveryAddress || "",
        createdAt: userData.createdAt || "",
        updatedAt: userData.updatedAt || "",
        password: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch user profile");
      setTimeout(() => setError(""), 4000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setIsSaved(false);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const updateData = {
      name: formData.name,
      email: formData.email,
      age: formData.age,
      country: formData.country,
      deliveryAddress: formData.deliveryAddress,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }
    try {
      await api.put("/api/users/profile", updateData);
      await createNotification(
        "Profile Updated Successfully!!",
        "Your profile information has been updated successfully. Thanks for keeping your information current.",
        "info"
      );
      setSuccess("profile updated successfully!");
      setLoading(false);
      setIsSaved(true);
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      setTimeout(() => {
        setIsSaved(false);
      }, 4000);
      setTimeout(() => {
        setSuccess("");
        setIsSaved(false);
      }, 4000);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update user profile"
      );
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Please enter your password");
      return;
    }

    setDeletingAccount(true);
    setDeleteError("");

    try {
      await api.delete("/api/users/delete-account", {
        data: { password: deletePassword },
      });

      localStorage.removeItem("user");
      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      if (error.response?.status === 401) {
        if (error.response?.data?.isAuthError) {
          localStorage.removeItem("user");
          setTimeout(() => {
            setLoading(true);
          }, 1000); //here
          logout();
          navigate("/login", { replace: true });
        } else {
          setDeleteError("Incorrect password");
          setConfirmDeleteModalOpen(false);
          setDeleteModalOpen(true);
        }
      } else {
        setDeleteError(
          error.response?.data?.message || "Failed to delete account"
        );
        setConfirmDeleteModalOpen(false);
        setDeleteModalOpen(true);
      }
    } finally {
      setDeletingAccount(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const handleCloseModals = () => {
    setDeleteModalOpen(false);
    setConfirmDeleteModalOpen(false);
    setDeletePassword("");
    setDeleteError("");
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

  // if (loading) {
  //   return (
  //     <div>
  //       <Backdrop
  //         sx={(theme) => ({ color: "#6055d8", zIndex: theme.zIndex.drawer + 1 })}
  //         open={loading}
  //       >
  //         <CircularProgress  color="inherit"/>
  //       </Backdrop>
  //     </div>
  //   );
  // }

  return (
    <section className="userPages-main-container">
      <div className="usermenuPages-title-container">
        <NavLink to="/user-menu">
          <span>
            <IoChevronBackOutline size={25} />
          </span>
        </NavLink>
      </div>

      <p id="usermenuPages-title">Profile</p>

      <div
        className="avatar-name-email-container"
        id="user-name-img-flex-holder"
      >
        <Stack direction="row" spacing={2}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              id="avatar-container-id"
              alt={images[0].alt}
              src={images[0].src}
            />
          </StyledBadge>
        </Stack>
        <span>
          <p>{formData.name || "Nothing to see here"} </p>
        </span>
      </div>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Stack sx={{ width: "100%" }} spacing={2}>
          {error && (
            <Alert className="alert-message-holder" severity="error">
              {error}
            </Alert>
          )}
        </Stack>
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {success && (
          <Alert className="alert-message-holder" severity="success">
            {success}
          </Alert>
        )}
      </Snackbar>

      <form className="profile-form-container" onSubmit={updateUserProfile}>
        <TextField
          className="profile-text-field"
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          className="profile-text-field"
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <main className="age-span">
          <Stack direction="row" spacing={2}>
            <Button disabled>Age:{formData.age}</Button>
          </Stack>
        </main>

        <TextField
          className="profile-text-field"
          fullWidth
          label="Address"
          name="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={handleInputChange}
        />
        <TextField
          className="profile-text-field"
          fullWidth
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleInputChange}
        />
        <TextField
          className="profile-text-field"
          fullWidth
          label="New Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <span>Leave this input blank to keep your current password</span>
        <TextField
          className="profile-text-field"
          fullWidth
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
        />
        <span>Leave this input blank to keep your current password</span>
        <div className="timestamp-container">
          <main>Account Created: {formatDate(formData.createdAt)}</main>
          <main>Last Updated: {formatDate(formData.updatedAt)}</main>
        </div>
        <button
          type="submit"
          className="userDetails-update-btn"
          disabled={loading || isSaved}
        >
          {loading ? (
            <CircularProgress className="btn-progress" size={24} />
          ) : isSaved ? (
            "Saved"
          ) : (
            "Update Details"
          )}
        </button>

        <button
          type="button"
          id="deleteBtn-warning"
          className="userDetails-update-btn"
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete Account
        </button>
      </form>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        aria-labelledby="delete-modal-title"
      >
        <Box sx={modalStyle}>
          <h2 className="delete-modal-title">Delete Account</h2>
          <Typography
            className="delete-modal-title"
            style={{
              color: "#000000",
              marginBottom: "16px",
              marginTop: "16px",
              fontSize: '18px',
            }}
          >
            {" "}
            Please enter your password to confirm account deletion:
          </Typography>
          <TextField
            fullWidth
            type="password"
            label="Enter Password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            margin="normal"
            error={!!deleteError}
            helperText={deleteError}
          />
          <div className="cart-modal-del-btnHolder">
            <button className="cart-modal-button"
              onClick={() => {
                if (!deletePassword) {
                  setDeleteError("Please enter your password");
                  return;
                }
                setDeleteModalOpen(false);
                setConfirmDeleteModalOpen(true);
              }}
            >
              Continue
            </button>
            <button className="cart-modal-button"
              onClick={handleCloseModals}
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>

      <Modal
        open={confirmDeleteModalOpen}
        onClick={handleCloseModals}
        aria-labelledby="confirm-delete-modal-title"
      >
        <Box sx={modalStyle}>
          <h2 className="delete-modal-title">Final Confirmation</h2>
          <Typography
            className="delete-modal-title"
            style={{
              color: "#dc3545",
              marginBottom: "16px",
              marginTop: "16px",
              fontSize: '18px',
            }}
          >
            Warning: Deleted accounts cannot be recovered. All your data will be
            permanently lost.
          </Typography>
          <div className="cart-modal-del-btnHolder">
            <button
              className="cart-modal-button"
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
            >
              {deletingAccount ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Yes, Delete!"
              )}
            </button>
            <button
              className="cart-modal-button"
              onClick={() => {
                setConfirmDeleteModalOpen(false);
                setDeleteModalOpen(true);
              }}
              disabled={deletingAccount}
            >
              Go Back
            </button>
          </div>
        </Box>
      </Modal>
    </section>
  );
};

export default ProfilePage;
