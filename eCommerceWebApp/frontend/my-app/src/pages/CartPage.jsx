import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../store/CartContext";
import { HiPlus } from "react-icons/hi2";
import { RxMinus } from "react-icons/rx";
import {Box, Modal, Typography} from "@mui/material/";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

const CartPage = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
      <h4 className="prod-header" id="cart-title-header">Bag</h4>
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

          <button className="checkout-btns-style" onClick={handleOpen}>
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

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className="delete-modal-title">
            Do you want to clear your cart?
          </h2>
          <Typography
            className="delete-modal-title"
            style={{
              color: "#000000",
              marginBottom: "16px",
              marginTop: "16px",
              fontSize: '18px',
            }}
          >
            Selected items will be removed from this list.
          </Typography>
          <span className="cart-modal-del-btnHolder">
            <button className="cart-modal-button" onClick={handleClose}>
              No
            </button>
            <button
              className="cart-modal-button"
              onClick={() => {
                clearCart();
                handleClose();
              }}
            >
              Yes
            </button>
          </span>
        </Box>
      </Modal>
    </section>
  );
};

export default CartPage;
