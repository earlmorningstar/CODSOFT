import { createContext, useReducer, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

const initialState = {
  items: [],
  totalAmount: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        };
        return {
          ...state,
          items: updatedItems,
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.payload, quantity: 1 }],
        };
      }

    case "INCREASE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload
              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "CLEAR_CART":
      return { ...state, items: [], totalAmount: 0 };

    case "SET_TOTAL_AMOUNT":
      return { ...state, totalAmount: action.payload };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const total = cartState.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    dispatch({ type: "SET_TOTAL_AMOUNT", payload: total });
  }, [cartState.items]);

  const addItemToCart = (item) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const increaseQuantity = (id) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: id });
  };

  const decreaseQuantity = (id) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: id });
  };

  const removeItemFromCart = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const checkout = async () => {
    try {
      const response = await axios.post("/api/orders/checkout");
      return response.data.data;
    } catch (error) {
      console.error(
        "Failed to initiate checkout",
        error.response?.data || error
      );
      throw new Error("Checkout failed");
    }
  };

  const placeOrder = async (paymentDetails) => {
    try {
      const response = await axios.post("/api/orders", {
        items: cartState.items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        totalAmount: cartState.totalAmount,
        paymentDetails,
      });
      clearCart();
      alert("Order placed successfully!");
      return response.data.data;
    } catch (error) {
      console.error("Failed to place order:", error.response?.data || error);
      throw new Error("Order placement failed");
    }
  };

  return (
    <CartContext.Provider
      value={{
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItemToCart,
        removeItemFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        checkout,
        placeOrder,
      }}
    >
      {" "}
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
