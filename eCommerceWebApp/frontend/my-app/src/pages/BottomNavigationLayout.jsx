import { NavLink, Outlet } from "react-router-dom";

const BottomNavigationLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      
      <div style={{ flex: 1, overflow: "auto" }}>
        <Outlet />
      </div>

    
      <nav style={{ display: "flex", justifyContent: "space-around", padding: "1rem", borderTop: "1px solid #ccc" }}>
        <NavLink to="/homepage" end>
           Home
        </NavLink>
        <NavLink to="/search">
          Search
        </NavLink>
        <NavLink to="/cart">
           Cart
        </NavLink>
        <NavLink to="/profile">
         Profile
        </NavLink>
      </nav>
    </div>
  );
};

export default BottomNavigationLayout;
