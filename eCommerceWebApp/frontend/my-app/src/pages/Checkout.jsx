import { useContext, useState } from "react";
import CartContext from "../store/CartContext";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Box, TextField, Stack, Alert, CircularProgress } from "@mui/material";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const cartCtx = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartCtx.items.length === 0) {
      setErrorMessage("Your bag is empty. Please add items before checkout.");
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
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
        setIsProcessing(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        await cartCtx.placeOrder({
          paymentIntentId: paymentResult.paymentIntent.id,
          status: paymentResult.paymentIntent.status,
          amount: paymentResult.paymentIntent.amount / 100,
        });

        setSuccessMessage("Payment successful! Your order has been placed.");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/homepage");
        }, 4000);
        //Redirec to order history page (after setting up)
      }
    } catch (error) {
      console.error("Checkout failed:", error.message);
      setErrorMessage("Checkout failed. Please try again.");
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

  return (
    <form className="checkoutForm-container" onSubmit={handleCheckout}>
      <p>Checkout</p>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label={
            <div className="auth-label-flex">
              Email Address <span style={{ color: "red" }}>*</span>
            </div>
          }
          variant="standard"
        />
        <TextField
          label={
            <div className="auth-label-flex">
              Delivery Address <span style={{ color: "red" }}>*</span>
            </div>
          }
          variant="standard"
        />
      </Box>

      <CardElement options={cardElementOptions} />
      <button
        className="signup-login-btn"        
      >
        Save Checkout & Card Details
      </button>
      <button
        className="signup-login-btn"
        type="submit"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Confirm Payment & Place Order"
        )}
      </button>
      {errorMessage && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="error">{errorMessage}</Alert>
        </Stack>
      )}
      {successMessage && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert severity="success">{successMessage}</Alert>
        </Stack>
      )}
    </form>
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
