import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import CartContext from "../store/CartContext";
import { NotificationContext } from "../context/NotificationContext";
import { RiMenu2Fill, RiSettings2Line } from "react-icons/ri";
import { GoBell, GoX, GoHome, GoSearch } from "react-icons/go";
import { IoCartOutline } from "react-icons/io5";
import { PiHandbag } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import {
  Modal,
  Box,
  Backdrop,
  Typography,
  CircularProgress,
} from "@mui/material";

import "./Index.css";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

const images = [{ src: "/images/avatar1.jpg", alt: "Avatar 1" }];

const RootLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const { items: cartItems } = useContext(CartContext);
  const cartItemCount = cartItems.length;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isHomepage = location.pathname === "/homepage";

  const handleLogoutClick = () => {
    setSidebarOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    setIsLogoutModalOpen(false);
    setTimeout(() => {
      logout();
      navigate("/login");
      setLoading(false);
    }, 1000);
  };

  const handleNotificationPage = () => {
    navigate("/notification");
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <section className="root-main-container">
        {isHomepage && (
          <>
            <span onClick={toggleSidebar}>
              <RiMenu2Fill size={20} />
            </span>
            <h3>TrendVault</h3>
            <span onClick={handleNotificationPage}>
              <GoBell size={20} />
              {unreadCount > 0 && (
                <p className="cartCount" id="notification-Count-id">
                  {unreadCount}
                </p>
              )}{" "}
            </span>
          </>
        )}
      </section>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="avatar-name-email-container">
            <img
              className="avatar-container"
              src={images[0].src}
              alt={images[0].alt}
            />

            <span>
              <p>{user?.name || "Nothing to see here"} </p>
              <p>{user?.email || "Nothing to see here"}</p>
            </span>
          </div>
          <span onClick={closeSidebar} className="close-icon">
            <GoX size={20} />
          </span>
        </div>
        <nav className="sidebar-nav">
          <NavLink
            to="/homepage"
            onClick={closeSidebar}
            className="sidebar-link"
          >
            <GoHome size={20} /> Homepage
          </NavLink>
          <NavLink to="/search" onClick={closeSidebar} className="sidebar-link">
            <GoSearch size={20} /> Search
          </NavLink>
          <NavLink to="/cart" onClick={closeSidebar} className="sidebar-link">
            <IoCartOutline size={20} />
            <p id="cartCount-holder-id">
              {cartItemCount > 0 && (
                <p className="cartCount" id="cartCount-id">
                  {cartItemCount}
                </p>
              )}{" "}
              Cart
            </p>
          </NavLink>
          <NavLink to="/order" onClick={closeSidebar} className="sidebar-link">
            <PiHandbag size={20} /> Order
          </NavLink>
          <NavLink
            to="/user-menu"
            onClick={closeSidebar}
            className="sidebar-link"
          >
            <FaRegUser size={20} /> User Menu
          </NavLink>
          <span>OTHERS</span>
          <NavLink
            to="/profile"
            onClick={closeSidebar}
            className="sidebar-link"
          >
            <RiSettings2Line size={20} /> Settings
          </NavLink>
          <NavLink
            to="/profile"
            onClick={closeSidebar}
            className="sidebar-link"
          >
            <AiOutlineExclamationCircle size={20} /> About Us
          </NavLink>
          <button className="root-logout-btn" onClick={handleLogoutClick}>
            <FiLogOut size={20} />
            Logout
          </button>
        </nav>

        <Modal open={isLogoutModalOpen} onClose={handleCloseModal}>
          <Box sx={modalStyle}>
            <div className="verify-password-title">
              <h2 style={{ marginBottom: "20px" }}>Logout Confirmation</h2>
              <Typography
                className="delete-modal-title"
                style={{
                  color: "#000000",
                  marginBottom: "20px",
                  marginTop: "16px",
                  fontSize: "18px",
                }}
              >
                Do you want to logout?
              </Typography>
            </div>

            <span className="cart-modal-del-btnHolder">
              <button className="cart-modal-button" onClick={handleLogout}>
                Yes, Logout!
              </button>
              <button className="cart-modal-button" onClick={handleCloseModal}>
                Cancel
              </button>
            </span>
          </Box>
        </Modal>

        <Backdrop
          sx={{
            color: "#6055d8",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </aside>

      <main className="root-main-outlet">
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
