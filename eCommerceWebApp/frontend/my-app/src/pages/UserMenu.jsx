import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaRegUser, FaRegHeart } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";
import { FaRegCreditCard } from "react-icons/fa6";
import { FiLogOut, FiSettings } from "react-icons/fi";
import {
  Modal,
  Box,
  Backdrop,
  CircularProgress,
  Typography,
} from "@mui/material";

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

const UserMenu = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
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
  return (
    <section className="user-profile-main-container">
      <div className="userMenu-links-main-container">
        <span className="userMenu-header">User Menu</span>
        <NavLink className="userMenu-nav-links" to="/profile">
          <span className="userMenu-icon-title-flex">
            <FaRegUser size={20} /> Profile
          </span>
          <span>
            <IoChevronForward />
          </span>
        </NavLink>
        <NavLink className="userMenu-nav-links" to="/saved-payment-detail">
          <span className="userMenu-icon-title-flex">
            <FaRegCreditCard size={20} /> Saved Payment Card
          </span>
          <span>
            <IoChevronForward />
          </span>
        </NavLink>
        <NavLink className="userMenu-nav-links" to="/wishlist">
          <span className="userMenu-icon-title-flex">
            <FaRegHeart size={20} /> Whishlist
          </span>
          <span>
            <IoChevronForward />
          </span>
        </NavLink>
        <NavLink className="userMenu-nav-links" to="/Settings">
          <span className="userMenu-icon-title-flex">
            <FiSettings size={20} /> Settings
          </span>
          <span>
            <IoChevronForward />
          </span>
        </NavLink>
        <div
          className="userMenu-nav-links"
          onClick={handleLogoutClick}
          style={{ cursor: "pointer" }}
        >
          <span className="userMenu-icon-title-flex">
            <FiLogOut size={20} /> Logout
          </span>
        </div>
      </div>

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
    </section>
  );
};

export default UserMenu;
