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
  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <section className="btm-main-container">
      <div className="btm-root-main-outlet">
        <Outlet />
      </div>

      <nav className="btm-nav-root-container">
        <NavLink className="btm-bar-navlinks" to="/homepage" end>
          <GoHome color="#838383" size={20} />
        </NavLink>
        <NavLink className="btm-bar-navlinks" to="/search">
          <GoSearch color="#838383" size={20} />
        </NavLink>
        <NavLink className="btm-bar-navlinks" to="/cart">
          <span className="cartCount-holder">
            <IoCartOutline color="#838383" size={20} />
            {cartItemCount > 0 && <p className="cartCount">{cartItemCount}</p>}
          </span>
        </NavLink>
        <NavLink className="btm-bar-navlinks" to="/order">
          <PiHandbag color="#838383" size={20} />
        </NavLink>
        <NavLink className="btm-bar-navlinks" to="/user-menu">
          <FaRegUser color="#838383" size={20} />
        </NavLink>
      </nav>
    </section>
  );
};

export default BottomNavigationLayout;
