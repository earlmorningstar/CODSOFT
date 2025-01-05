import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
import OrderHistory from "./pages/OrderHistory";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ProductsPage from "./pages/ProductsPage";
import Checkout from "./pages/Checkout";
import ErrorPage from "./pages/ErrorPage";
import UserMenu from "./pages/UserMenu";
import SavedPaymentDetailsPage from "./pages/SavedPaymentDetailsPage";
import Settings from "./pages/Settings";
import Wishlist from "./pages/Wishlist";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import Notification from "./pages/Notification";
import SelectTabsPage from "./pages/SelectTabsPage";
import AboutUs from "./pages/AboutUs";
import ForgotPasswordForm from "./components/ForgotPassword/ForgotPasswordForm";
import VerifyResetCode from "./components/ForgotPassword/VerifyResetCode";
import ResetPassword from "./components/ForgotPassword/ResetPassword";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
      { path: "/forgot-password", element: <ForgotPasswordForm /> },
      { path: "/verify-reset-code", element: <VerifyResetCode /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "welcome-note-page", element: <WelcomeNote /> },
      {
        path: "/",
        element: (
          <>
            <BottomNavigationLayout />
          </>
        ),
        children: [
          { path: "/homepage", element: <HomePage /> },
          { path: "/search", element: <SearchPage /> },
          { path: "/cart", element: <CartPage /> },
          { path: "/user-menu", element: <UserMenu /> },
          { path: "/order", element: <OrderHistory /> },
          { path: "/orders/:orderId", element: <OrderDetailsPage /> },
          { path: "/products", element: <ProductsPage /> },
          { path: "/products/:id", element: <ProductDetailsPage /> },
          { path: "/checkout", element: <Checkout /> },
          { path: "/profile", element: <ProfilePage /> },
          {
            path: "/saved-payment-detail",
            element: <SavedPaymentDetailsPage />,
          },
          { path: "/settings", element: <Settings /> },
          { path: "/wishlist", element: <Wishlist /> },
          { path: "/notification", element: <Notification /> },
          { path: "/category/:category", element: <SelectTabsPage /> },
          { path: "/about-us", element: <AboutUs /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};
export default App;
