import { NavLink } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import AppMode from "./AppMode";

const Settings = () => {
  return (
    <section>
      <div className="usermenuPages-title-container">
        <span className="backIcon">
          <NavLink to="/user-menu">
            <IoChevronBackOutline size={25} color="#121212" />
            <IoChevronBackOutline size={25} color="#ffffff" />
          </NavLink>
        </span>
      </div>
      <p className="usermenuPages-title-textCenter">Settings</p>

      <div className="userMenu-links-main-container">
        <AppMode />
      </div>
    </section>
  );
};

export default Settings;
