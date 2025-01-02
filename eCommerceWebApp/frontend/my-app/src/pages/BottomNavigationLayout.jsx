import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import CartContext from "../store/CartContext";
import ScrollToTop from "../hooks/ScrollToTop";
import SessionModalPortal from "../components/SessionModalPortal";
import { GoHome, GoSearch } from "react-icons/go";
import { IoCartOutline } from "react-icons/io5";
import { PiHandbag } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";

const BottomNavigationLayout = () => {
  const { items: cartItems } = useContext(CartContext);
  const cartItemCount = cartItems.length;
  const [showInactivityModal, setShowInactivityModal] = useState(false);

  useEffect(() => {
    const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
    let inactivityTimer;

    const resetInactivityTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }

      inactivityTimer = setTimeout(() => {
        setShowInactivityModal(true);
      }, INACTIVITY_TIMEOUT);
    };

    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, []);

  return (
    <section className="btm-main-container">
      <ScrollToTop />
      <div className="btm-root-main-outlet">
        <Outlet />
      </div>

      {showInactivityModal && (
        <SessionModalPortal
          onClose={() => {
            setShowInactivityModal(false);
          }}
        />
      )}

      <nav className="btm-nav-root-container">
        <NavLink
          className={({ isActive }) =>
            `btm-bar-navlinks ${isActive ? "active-link" : ""}`
          }
          to="/homepage"
          end
        >
          <GoHome size={22} />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `btm-bar-navlinks ${isActive ? "active-link" : ""}`
          }
          to="/search"
        >
          <GoSearch size={22} />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `btm-bar-navlinks ${isActive ? "active-link" : ""}`
          }
          to="/cart"
        >
          <span className="cartCount-holder">
            <IoCartOutline size={22} />
            {cartItemCount > 0 && <p className="cartCount">{cartItemCount}</p>}
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `btm-bar-navlinks ${isActive ? "active-link" : ""}`
          }
          to="/order"
        >
          <PiHandbag size={22} />
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `btm-bar-navlinks ${isActive ? "active-link" : ""}`
          }
          to="/user-menu"
        >
          <FaRegUser size={22} />
        </NavLink>
      </nav>
    </section>
  );
};

export default BottomNavigationLayout;
