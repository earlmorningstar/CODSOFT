import { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
// import api from "../utils/api";
import { Alert, Snackbar, Backdrop, CircularProgress } from "@mui/material";
import { IoChevronBackOutline } from "react-icons/io5";
import { NotificationContext } from "../context/NotificationContext";

const Notification = () => {
  // const [notifications, setNotifications] = useState([]);
  const { notifications, markAsRead } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (notifications) {
      setLoading(false);
    }
    // fetchNotifications();
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
      setError("failed to mark notification as read. Please try again");
    }
  };

  // const fetchNotifications = async () => {
  //   try {
  //     const response = await api.get("api/notifications");
  //     setNotifications(response.data);
  //   } catch (error) {
  //     setError("Failed to fetch notification");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const markAsRead = async (notificationId) => {
  //   try {
  //     await api.patch(`/api/notifications/${notificationId}/read`);
  //     setNotifications(
  //       notifications.map((notification) =>
  //         notification._id === notificationId
  //           ? { ...notification, read: true }
  //           : notification
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Failed to mark notification as read", error);
  //   }
  // };

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
        <NavLink to="/homepage">
          <span>
            <IoChevronBackOutline size={25} />
          </span>
        </NavLink>
      </div>
      <p className="usermenuPages-title-textCenter">Notification</p>

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

      {/* {error && <p className="error-text">{error}</p>} */}

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
