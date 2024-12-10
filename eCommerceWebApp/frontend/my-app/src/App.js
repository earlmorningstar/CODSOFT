import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import BottomNavigationLayout from "./pages/BottomNavigationLayout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import WelcomeNote from "./pages/WelcomeNote";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "welcome-note-page", element: <WelcomeNote /> },
      {
        path: "/",
        element: <BottomNavigationLayout />,
        children: [
          { path: "/homepage", element: <HomePage /> },
          { path: "/search", element: <SearchPage /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
