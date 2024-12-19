import { NavLink } from "react-router-dom";
import { FaRegUser, FaRegHeart } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";
import { FaRegCreditCard } from "react-icons/fa6";
import { FiLogOut, FiSettings } from "react-icons/fi";

const UserMenu = () => {
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
        <div className="userMenu-nav-links">
          <span className="userMenu-icon-title-flex">
            <FiLogOut size={20} /> Logout
          </span>
        </div>
      </div>
    </section>
  );
};

export default UserMenu;
