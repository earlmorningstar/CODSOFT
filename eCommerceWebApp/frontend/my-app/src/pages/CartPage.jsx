import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../store/CartContext";
import { HiPlus } from "react-icons/hi2";
import { RxMinus } from "react-icons/rx";

const CartPage = () => {
  const {
    items: cartItems,
    clearCart,
    removeItemFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleProductPage = () => {
    navigate("/products");
  };

  const handleCheckoutPage = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-alert">
        <h1>Cart is Empty</h1>
        <button onClick={handleProductPage}>Add an item</button>
      </div>
    );
  }

  return (
    <section className="cart-main-container">
      <h4 className="prod-header">Bag</h4>
      <div className="cart-prod-checkout-flex">
        <ul className="cart-ul">
          {cartItems.map((item) => (
            <li key={item.id} className="cart-product-grid">
              <div className="cart-prod-card">
                <span className="cart-img">
                  <img src={item.image} alt={item.title} />
                </span>
                <span className="cart-prod-card-details">
                  <h4>{item.title}</h4>
                  <p>Price: ${item.price.toFixed(2)}</p>
                  <div className="cart-prod-qty-container">
                    <button onClick={() => decreaseQuantity(item.id)}>
                      <RxMinus size={16} />
                    </button>
                    <p>{item.quantity}</p>
                    <button onClick={() => increaseQuantity(item.id)}>
                      <HiPlus size={16} />
                    </button>
                  </div>
                  <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    className="removeItemBtn"
                    onClick={() => removeItemFromCart(item.id)}
                  >
                    Remove from Cart
                  </button>
                </span>
              </div>
            </li>
          ))}

          <button className="checkout-btns-style" onClick={clearCart}>
            Clear Cart
          </button>
        </ul>
        <div className="cart-checkout-container">
          <h4>Summary</h4>
          <p>Total Price: ${totalPrice.toFixed(2)}</p>
          <span>
            <button
              className="checkout-btns-style"
              id="checkout-btn-id"
              onClick={handleProductPage}
            >
              Add more products
            </button>
            <button
              className="checkout-btns-style"
              id="checkout-btn-id"
              onClick={handleCheckoutPage}
            >
              Checkout
            </button>
          </span>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
