import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import CartContext from "../store/CartContext";
import api from "../utils/api";
import { RiMenu2Fill, RiSettings2Line } from "react-icons/ri";
import { GoBell, GoX, GoHome, GoSearch } from "react-icons/go";
import { IoCartOutline } from "react-icons/io5";
import { PiHandbag } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import "./Index.css";

const images = [{ src: "/images/avatar1.jpg", alt: "Avatar 1" }];

const RootLayout = () => {
  const { user } = useContext(AuthContext);
  const { items: cartItems } = useContext(CartContext);
  const cartItemCount = cartItems.length;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  const location = useLocation();
  const isHomepage = location.pathname === "/homepage";

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if(!user?.token) return;
        
        const response = await api.get("/api/notifications/unread/count");
        setNotificationCount(response.data.count);
      } catch (error) {
        console.error("Failed to fetch notification count", error);
      }
    };
    fetchNotificationCount();
  }, []);

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
            <NavLink to="/notification">
              <span>
                <GoBell size={20} />
                {notificationCount > 0 && (
                  <p className="cartCount" id="notification-Count-id">
                    {notificationCount}
                  </p>
                )}{" "}
              </span>
            </NavLink>
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
        </nav>
      </aside>

      <main className="root-main-outlet">
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
