import { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  Alert,
  Snackbar,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { IoChevronBackOutline } from "react-icons/io5";
import { NotificationContext } from "../context/NotificationContext";

const Notification = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    if (notifications) {
      setLoading(false);
      checkAndShowHints();
    }
  }, [notifications]);

  const checkAndShowHints = () => {
    const lastHintTime = localStorage.getItem("lastHintTime");
    const currentTime = new Date().getTime();

    if (
      !lastHintTime ||
      currentTime - parseInt(lastHintTime) > 24 * 60 * 60 * 1000
    ) {
      setShowHints(true);
      localStorage.setItem("lastHintTime", currentTime.toString());

      setTimeout(() => {
        setShowHints(false);
      }, 6000);
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

  const handleClick = async (notification) => {
    if (!notification.read) {
      try {
        await markAsRead(notification._id);
      } catch (error) {
        setError("Failed to mark notification as read. Please try again");
      }
    }
  };

  const handleDeleteClick = (notification, e) => {
    e.stopPropagation();
    setSelectedNotification(notification);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteNotification(selectedNotification._id);
      setShowDeleteDialog(false);
      setSelectedNotification(null);
    } catch (error) {
      setError("Failed to delete notification. Please try again");
    }
  };

  const handleDeleteAllConfirm = async () => {
    try {
      await clearNotifications();
      setShowDeleteAllDialog(false);
    } catch (error) {
      setError("Failed to deelete all notifications. Please try again");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="notification-section">
      <div className="usermenuPages-title-container">
        <span className="backIcon">
          <NavLink to="/homepage">
            <IoChevronBackOutline size={25} color="#121212" />
            <IoChevronBackOutline size={25} color="#ffffff" />
          </NavLink>
        </span>
      </div>
      <p className="usermenuPages-title-textCenter">Notification</p>

      {notifications.length > 0 && (
        <div className="wishlist-clear-btn-holder">
          <button onClick={markAllAsRead} className="clear-wishlist-btn">
            Mark All As Read
          </button>
          <button
            onClick={() => setShowDeleteAllDialog(true)}
            className="clear-wishlist-btn delete-btn"
          >
            Delete All
          </button>
        </div>
      )}

      <div
        className="notifications-container">
        {loading ? (
          <Backdrop
            sx={{
              color: "#6055d8",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${notification.type} ${
                !notification.read ? "unread" : ""
              }`}
              onClick={() => handleClick(notification)}
            >
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <div className="notification-date-btn-holder">
                <span className="notification-date">
                  {formatDate(notification.createdAt)}
                </span>
                <button
                  onClick={(e) => handleDeleteClick(notification, e)}
                  className="clear-wishlist-btn"
                >
                  Delete
                </button>
              </div>
              {!notification.read && (
                <span className="unread-indicator">●</span>
              )}
            </div>
          ))
        ) : (
          <p className="no-notification-text">You have no new notification</p>
        )}
      </div>

      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Notification</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this notification?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
        aria-labelledby="delete-all-dialog-title"
      >
        <DialogTitle id="delete-all-dialog-title">
          Delete All Notifications
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete all notifications? This action cannot
          be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteAllDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAllConfirm} color="error">
            Delete All
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showHints}
        autoHideDuration={6000}
        onClose={() => setShowHints(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ width: "100%" }}
      >
        <Alert
          severity="info"
          sx={{ width: "100%", "& .MuiAlert-message": { width: "100%" } }}
        >
          • Tap unread notification to mark as read
        </Alert>
      </Snackbar>
    </section>
  );
};

export default Notification;