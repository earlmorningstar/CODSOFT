import {
  RouterProvider,
  createBrowserRouter,
  // ScrollRestoration,
} from "react-router-dom";
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
import OrderPage from "./pages/OrderPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductsPage from "./pages/ProductsPage";
import Checkout from "./pages/Checkout";
import ScrollPosition from "./hooks/ScrollPosition";

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
        element: (
          <>
            <ScrollPosition />
            <BottomNavigationLayout />
          </>
        ),
        children: [
          { path: "/homepage", element: <HomePage /> },
          { path: "/search", element: <SearchPage /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/profile", element: <ProfilePage /> },
          { path: "/order", element: <OrderPage /> },
          { path: "/products", element: <ProductsPage /> },
          { path: "/products/:id", element: <ProductDetailsPage /> },
          { path: "/checkout", element: <Checkout /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
