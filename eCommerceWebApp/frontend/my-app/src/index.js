import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AuthProvider from "./context/AuthContext";
import { CartProvider } from "./store/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { WishlistProvider } from "./store/WishlistContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
// import ScrollPosition from "./hooks/ScrollPosition";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <ScrollPosition> */}
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <WishlistProvider>
          <NotificationProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </NotificationProvider>
        </WishlistProvider>
      </AuthProvider>
    </Elements>
    {/* </ScrollPosition> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
