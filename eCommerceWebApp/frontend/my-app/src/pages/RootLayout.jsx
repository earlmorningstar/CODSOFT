import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { GoBell } from "react-icons/go";
import { GoX } from "react-icons/go";
import { GoHome } from "react-icons/go";
import { GoSearch } from "react-icons/go";
import { IoCartOutline } from "react-icons/io5";
import { PiHandbag } from "react-icons/pi";
import { VscAccount } from "react-icons/vsc";
import { RiSettings2Line } from "react-icons/ri";
import { AiOutlineExclamationCircle } from "react-icons/ai";

import "./Index.css";

const images = [{ src: "/images/avatar1.png", alt: "Avatar 1" }];

function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <section className="root-main-container">
        <span onClick={toggleSidebar}>
          <RiMenu2Fill size={20} />
        </span>

        <h3>TrendVault</h3>
        <span>
          <GoBell size={20} />
        </span>
      </section>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div>
            <img src={images[0].src} alt={images[0].alt} />
            <span>
              <p>Full Name</p>
              <p>Email Address</p>
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
            <IoCartOutline size={20} /> Cart
          </NavLink>
          <NavLink to="/order" onClick={closeSidebar} className="sidebar-link">
            <PiHandbag size={20} /> Order
          </NavLink>
          <NavLink
            to="/profile"
            onClick={closeSidebar}
            className="sidebar-link"
          >
            <VscAccount size={20} /> Profile
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
}

export default RootLayout;
