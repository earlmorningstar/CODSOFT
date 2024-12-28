import { useContext, useState, useEffect } from "react";
import CartContext from "../store/CartContext";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import api from "../utils/api";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Box,
  TextField,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { IoChevronBackOutline } from "react-icons/io5";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const cartCtx = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    deliveryAddress: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/users/profile");
      const userData = response.data;
      setUserData({
        email: userData.email || "",
        deliveryAddress: userData.deliveryAddress || "",
      });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to fetch user profile"
      );
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const createNotification = async (title, message, type) => {
    try {
      await api.post("/api/notifications", {
        title,
        message,
        type,
      });
    } catch (error) {
      console.error("Failed to create notification:", error);
    }
  };

  const saveCardDetails = async () => {
    setIsSavingCard(true);
    try {
      const cardElement = elements.getElement(CardElement);
      const { token } = await stripe.createToken(cardElement);

      await api.post("/api/users/cards/save-card", {
        last4: token.card.last4,
        expMonth: token.card.exp_month,
        expYear: token.card.exp_year,
        brand: token.card.brand,
      });

      setSuccessMessage("Card details saved successfully");
      setIsSavingCard(false);
      await createNotification(
        "Card Saved Successfully!",
        `Your card ending in ****${token.card.last4} has been saved securely for future transactions. You can now enjoy quicker checkouts on your next purchase.`,
        "info"
      );
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      setErrorMessage("Failed to save card details. Please try again");
      setIsSavingCard(false);
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartCtx.items.length === 0) {
      setErrorMessage("Your bag is empty. Please add an item before checkout.");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage("Stripe is not initialised yet");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      return;
    }

    setIsProcessing(true);

    try {
      const { clientSecret } = await cartCtx.checkout();

      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (paymentResult.error) {
        console.error("Payment Error:", paymentResult.error.message);
        setErrorMessage(`Payment failed: ${paymentResult.error.message}`);
        await createNotification(
          "Payment Failed!",
          "Your payment attempt was unsuccessful. Please try again to complete your order.",
          "error"
        );

        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
        setIsProcessing(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        const amount = paymentResult.paymentIntent.amount / 100;

        await cartCtx.placeOrder({
          paymentIntentId: paymentResult.paymentIntent.id,
          status: paymentResult.paymentIntent.status,
          amount: amount,
        });

        await createNotification(
          "Payment Successful!",
          `Your payment of $${amount} has been processed successfully. You can track your order on the "Order Tab". Thank you for your purchase!`,
          "success"
        );
        setSuccessMessage("Payment successful! Your order has been placed.");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/order");
        }, 3000);
      }
    } catch (error) {
      console.error("Checkout failed:", error.message);
      setErrorMessage("Checkout failed. Please try again.");

      await createNotification(
        "Payment Failed!",
        "Your payment attempt was unsuccessful. Please try again to complete your order.",
        "error"
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  useEffect(() => {
    if (errorMessage) {
      setShowError(true);
    }
  }, [errorMessage]);

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowError(false);
    setErrorMessage("");
  };

  useEffect(() => {
    if (successMessage) {
      setShowSuccess(true);
    }
  }, [successMessage]);

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowSuccess(false);
    setSuccessMessage("");
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  return (
    <>
      <div className="usermenuPages-title-container">
        <span className="backIcon" onClick={handleBackToCart}>
        <IoChevronBackOutline size={25} color="#121212"/>
        <IoChevronBackOutline size={25} color="#ffffff"/>
        </span>
      </div>
      <p className="usermenuPages-title-textCenter">Checkout</p>
      <form className="checkoutForm-container" onSubmit={handleCheckout}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            color: "#a6a5a5",
          }}
        >
          <TextField
            className="auth-label-flex-ii"
            label={
              <div className="auth-label-flex">
                Email Address <span style={{ color: "red" }}>*</span>
              </div>
            }
            variant="standard"
            value={userData.email}
          />
          <TextField
            label={
              <div className="auth-label-flex">
                Delivery Address <span style={{ color: "red" }}>*</span>
              </div>
            }
            variant="standard"
            value={userData.deliveryAddress}
            disabled
          />
        </Box>

        <CardElement options={cardElementOptions} />
        <button
          className="signup-login-btn"
          type="button"
          onClick={saveCardDetails}
          disabled={isSavingCard}
        >
          {isSavingCard ? (
            <CircularProgress size={15} color="#ffffff" />
          ) : (
            "Save Card Details"
          )}
        </button>
        <button
          className="signup-login-btn"
          type="submit"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <CircularProgress size={15} color="#ffffff" />
          ) : (
            "Confirm Payment & Place Order"
          )}
        </button>

        <Snackbar
          open={showError}
          autoHideDuration={3000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          {errorMessage && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="error">{errorMessage}</Alert>
            </Stack>
          )}
        </Snackbar>

        <Snackbar
          open={showSuccess}
          autoHideDuration={3000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          {successMessage && (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="success">{successMessage}</Alert>
            </Stack>
          )}
        </Snackbar>
      </form>
    </>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
