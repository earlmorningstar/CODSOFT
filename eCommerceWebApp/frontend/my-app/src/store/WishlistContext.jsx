import { createContext, useReducer, useEffect } from "react";
import api from "../utils/api";

const WishlistContext = createContext();

const initialState = {
  items: [],
};

const wishlistReducer = (state, action) => {
  switch (action.type) {
    case "SET_ITEMS":
      return {
        ...state,
        items: action.payload,
      };
    case "ADD_ITEM":
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => {
          const productId = item.product._id || item.product.shopifyProductId;
          return (
            productId !== action.payload &&
            item.product.shopifyProductId !== action.payload
          );
        }),
      };
    case "CLEAR_WISHLIST":
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlistState, dispatch] = useReducer(wishlistReducer, initialState);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get("/api/wishlist");
        dispatch({
          type: "SET_ITEMS",
          payload: response.data.data.items || [],
        });
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };
    fetchWishlist();
  }, []);

  const addToWishlist = async (product) => {
    try {
      const response = await api.post("/api/wishlist/add", {
        productId: product.id.toString(),
      });

      if (response.data && response.data.data) {
        dispatch({ type: "SET_ITEMS", payload: response.data.data.items });
      }
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      throw error;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await api.delete(`/api/wishlist/remove/${productId}`);

      if (response.data && response.data.data) {
        dispatch({ type: "SET_ITEMS", payload: response.data.data.items });
      } else {
        dispatch({ type: "REMOVE_ITEM", payload: productId });
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
     
      if (error.response?.status === 404) {
        dispatch({ type: "REMOVE_ITEM", payload: productId });
      }
      throw error;
    }
  };

  const clearWishlist = async () => {
    try {
      await api.delete("/api/wishlist/clear");
      dispatch({ type: "CLEAR_WISHLIST" });
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      throw error;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistState.items.some((item) => {
      const itemProductId = item.product._id || item.product.shopifyProductId;
      const normalizedProductId = productId.toString();
      return (
        itemProductId === normalizedProductId ||
        item.product.shopifyProductId === normalizedProductId
      );
    });
  };

  return (
    <WishlistContext.Provider
      value={{
        items: wishlistState.items,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
