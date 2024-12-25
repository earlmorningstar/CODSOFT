import { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import { IoCartOutline } from "react-icons/io5";
import { PiHandbag } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";
import CartContext from "../store/CartContext";

const BottomNavigationLayout = () => {
  const { items: cartItems } = useContext(CartContext);
  const cartItemCount = cartItems.length;

  return (
    <section className="btm-main-container">
      <div className="btm-root-main-outlet">
        <Outlet />
      </div>

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
