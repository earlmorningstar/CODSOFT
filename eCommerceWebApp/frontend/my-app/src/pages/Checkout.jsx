import { useContext } from "react";
import CartContext from "../store/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const cartCtx = useContext(CartContext);
  const stripe = useStripe();
  const elements = useElements();

  const handleCheckout = async () => {
    if (!stripe || !elements) {
      alert("Stripe is not initialised yet");
      return;
    }
    try {
      const { clientSecret } = await cartCtx.checkout();
      console.log("Client Secret:", clientSecret);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });
      console.log("Payment Result:", paymentResult);

      if (paymentResult.error) {
        console.error('Payment Error:', paymentResult.error.message);
        alert(`Payment failed: ${paymentResult.error.message}`);
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
    <Elements stripe={stripePromise}>
      <div>
        <h2>Checkout</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCheckout();
          }}
        >
          <CardElement options={cardElementOptions}/>
          <button type="submit">Confirm Payment & Place Order</button>
        </form>
      </div>
    </Elements>
  );
};

export default Checkout;
