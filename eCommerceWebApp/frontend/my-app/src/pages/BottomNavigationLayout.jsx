import { NavLink, Outlet } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import { IoCartOutline } from "react-icons/io5";
import { PiHandbag } from "react-icons/pi";
import { VscAccount } from "react-icons/vsc";

const BottomNavigationLayout = () => {
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
          <IoCartOutline color="#838383" size={20} />
        </NavLink>
        <NavLink className="btm-bar-navlinks" to="/order">
          <PiHandbag color="#838383" size={20} />
        </NavLink>
        <NavLink className="btm-bar-navlinks" to="/profile">
          <VscAccount color="#838383" size={20} />
        </NavLink>
      </nav>
    </section>
  );
};

export default BottomNavigationLayout;
