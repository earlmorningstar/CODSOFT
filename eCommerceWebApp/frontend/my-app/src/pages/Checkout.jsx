import { useContext, useState } from "react";
import CartContext from "../store/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const cartCtx = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartCtx.items.length === 0) {
      alert("Your bag is empty. Please add items before checkout.");
      return;
    }

    if (!stripe || !elements) {
      alert("Stripe is not initialised yet");
      return;
    }

    setIsProcessing(true);

    try {
      const { clientSecret } = await cartCtx.checkout();
      console.log("Client Secret:", clientSecret);

      const cardElement = elements.getElement(CardElement);

      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      console.log("Payment Result:", paymentResult);

      if (paymentResult.error) {
        console.error("Payment Error:", paymentResult.error.message);
        alert(`Payment failed: ${paymentResult.error.message}`);
        setIsProcessing(false);
        return;
      }

      if (paymentResult.paymentIntent.status === "succeeded") {
        console.log("Payment Intent:", paymentResult.paymentIntent);
        await cartCtx.placeOrder(paymentResult.paymentIntent);
        alert("Payment successful! Your order has been placed.");
        //Redirec to order history page
      }
    } catch (error) {
      console.error("Checkout failed:", error.message);
      alert("Checkout failed. Please try again.");
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
    <form onSubmit={handleCheckout}>
      <h2>Checkout</h2>
      <CardElement options={cardElementOptions} />
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? "Processing..." : "Confirm Payment & Place Order"}
      </button>
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
