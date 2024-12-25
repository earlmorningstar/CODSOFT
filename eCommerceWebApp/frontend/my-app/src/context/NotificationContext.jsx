import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import api from "../utils/api";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connectionError, setConnectionError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (notif) => !notif.read
    ).length;
    if (unreadCount !== unreadNotifications) {
      setUnreadCount(unreadNotifications);
    }
  }, [notifications, unreadCount]);

  const fetchNotifications = useCallback(async () => {
    if (!user?.token) return;

    try {
      const response = await api.get("/api/notifications");
      setNotifications(response.data);
      const unreadCount = response.data.filter((notif) => !notif.read).length;
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [user?.token]);

  useEffect(() => {
    let newSocket = null;

    if (user?.token) {
      console.log("Attempting to connect to:", process.env.REACT_APP_API_URL);

      newSocket = io(process.env.REACT_APP_API_URL, {
        auth: {
          token: user.token,
        },
        path: "/socket.io/",
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      newSocket.on("connect", () => {
        console.log("Connected to notification server");
        setConnectionError(null);
        fetchNotifications();
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error.message);
        setConnectionError(error.message);
      });

      newSocket.on("error", (error) => {
        console.error("Socket error:", error.message);
        setConnectionError(error.message);
      });

      newSocket.on("Disconnect", (reason) => {
        console.log("Disconnected from notification server:", reason);
      });

      newSocket.on("notification", (newNotification) => {
        console.log("New notification recieved:", newNotification);
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      newSocket.on("notification_read", (notificationId) => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, read: true } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      });

      newSocket.on("notifications_cleared", () => {
        setNotifications([]);
        setUnreadCount(0);
      });

      setSocket(newSocket);

      fetchNotifications();

      return () => {
        if (newSocket) {
          newSocket.off("notification");
          newSocket.off("notification_read");
          newSocket.off("notification_cleared");
          newSocket.close();
          setSocket(null);
        }
      };
    }
  }, [user?.token, fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      const notification = notifications.find((n) => n._id === notificationId);

      if (!notification || notification.read) {
        return;
      }

      await api.patch(`/api/notifications/${notificationId}/read`);
      socket?.emit("mark_as_read", notificationId);

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/api/notifications/mark-all-read");
      socket?.emit("mark_all_read");
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      throw error;
    }
  };

  const clearNotifications = async () => {
    try {
      await api.delete("/api/notifications/clear-all");
      socket?.emit("clear_notifications");
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to clear notifications:", error);
      throw error;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        socket,
        connectionError,
        refreshNotification: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
