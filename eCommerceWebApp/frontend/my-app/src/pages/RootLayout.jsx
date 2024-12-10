import { Outlet } from "react-router-dom";

function RootLayout() {
  return<>
  <div>This is root Layout</div>
  <main><Outlet /></main>
  </> 
}

export default RootLayout;
