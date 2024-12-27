import { NavLink } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import AppMode from "./AppMode";

const Settings = () => {
  return (
    <section>
      <div className="usermenuPages-title-container">
        <NavLink to="/user-menu">
          <span>
            <IoChevronBackOutline size={25} />
          </span>
        </NavLink>
      </div>
      <p className="usermenuPages-title-textCenter">Settings</p>

      <div className="userMenu-links-main-container">
        <AppMode />
      </div>
    </section>
  );
};

export default Settings;
