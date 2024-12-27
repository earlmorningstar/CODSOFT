import { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Alert, Snackbar, Backdrop, CircularProgress } from "@mui/material";
import { IoChevronBackOutline } from "react-icons/io5";
import { NotificationContext } from "../context/NotificationContext";

const Notification = () => {
  const { notifications, markAsRead, markAllAsRead } =
    useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (notifications) {
      setLoading(false);
    }
  }, [notifications]);

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

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (err) {
      setError("Failed to mark notification as read. Please try again");
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
    <section>
      <div className="usermenuPages-title-container">
          <span className="backIcon">
        <NavLink to="/homepage">
        <IoChevronBackOutline size={25} color="#121212" />
        <IoChevronBackOutline size={25} color="#ffffff" />
        </NavLink>
          </span>
      </div>
      <p className="usermenuPages-title-textCenter">Notification</p>
      <div className="wishlist-clear-btn-holder">
        <button onClick={markAllAsRead} className="clear-wishlist-btn">Mark All As Read</button>
      </div>

      {loading && (
        <Backdrop
          sx={{
            color: "#6055d8",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

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

      <div className="notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`notification-item ${notification.type} ${
              !notification.read ? "unread" : ""
            }`}
            onClick={() => handleMarkAsRead(notification._id)}
          >
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <span className="notification-date">
              {formatDate(notification.createdAt)}
            </span>
            {!notification.read && <span className="unread-indicator">●</span>}
          </div>
        ))}
        {!loading && notifications.length === 0 && (
          <p className="no-notification-text">You have no notifications yet</p>
        )}
      </div>
    </section>
  );
};

export default Notification;
