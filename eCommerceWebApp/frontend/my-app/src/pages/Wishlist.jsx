import { useContext } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import CartContext from "../store/CartContext";
import WishlistContext from "../store/WishlistContext";
import { FiHeart } from "react-icons/fi";
import { Pagination, Stack } from "@mui/material";
import { IoChevronBackOutline } from "react-icons/io5";

const Wishlist = () => {
  const {
    items: cartItems,
    addItemToCart,
    removeItemFromCart,
  } = useContext(CartContext);
  const {
    items: wishlistItems,

    removeFromWishlist,
    clearWishlist,
  } = useContext(WishlistContext);
  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = 16;
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get("page") || "1", 10);

  const alreadyInCart = (shopifyProductId) => {
    return cartItems.some(
      (item) =>
        item.shopifyProductId === shopifyProductId ||
        item.id === shopifyProductId
    );
  };

  const toggleCartButton = async (product) => {
    const cartItem = {
      id: product.id,
      shopifyProductId: product.id,
      shopifyVariantId: product.variants[0]?.id || null,
      title: product.title,
      price: parseFloat(product.variants[0]?.price || 0),
      quantity: 1,
      image: product.images[0]?.src || "https://via.placeholder.com/150",
    };

    if (alreadyInCart(product.id)) {
      removeItemFromCart(product.id);
    } else {
      addItemToCart(cartItem);
    }
  };

  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);
  const currentItems = wishlistItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="empty-cart-alert">
        <h2>Your Wishlist is Empty</h2>
        <p>Add items to your wishlist to keep track of products you love!</p>
        <button
          onClick={() => navigate("/products")}
          className="btn-add-to-bag"
        >
          {" "}
          Browse products
        </button>
      </div>
    );
  }

  return (
    <section>
      <div className="usermenuPages-title-container">
        <span className="backIcon">
          <NavLink to="/user-menu">
            <IoChevronBackOutline size={25} color="#121212" />
            <IoChevronBackOutline size={25} color="#ffffff" />
          </NavLink>
        </span>
      </div>

      <section>
        <p className="usermenuPages-title-textCenter">My Wishlist</p>
        <div className="wishlist-clear-btn-holder">
          {wishlistItems.length > 0 && (
            <button onClick={clearWishlist} className="clear-wishlist-btn">
              Clear Wishlist
            </button>
          )}
        </div>
        <div className="product-grid">
          {currentItems.map((item) => (
            <div className="productList-card" key={item.product._id}>
              <div className="prod-img-container">
                <img
                  src={
                    item.product.images?.[0]?.src ||
                    "https://via.placeholder.com/150"
                  }
                  alt={item.product.title}
                  className="product-image"
                />
                <FiHeart
                  className="heart-icon active"
                  size={25}
                  fill="rgb(251, 6, 6)"
                  stroke="rgb(251, 6, 6)"
                  onClick={() =>
                    removeFromWishlist(
                      item.product.shopifyProductId || item.product._id
                    )
                  }
                />
              </div>

              <div className="product-details">
                <span>{item.product.title}</span>
                <p>
                  ${item.product.variants[0]?.price || "No Available Price"}
                </p>
                <div className="product-actions">
                  <button
                    onClick={() =>
                      navigate(
                        `/products/${
                          item.product.shopifyProductId || item.product._id
                        }`
                      )
                    }
                  >
                    View Details
                  </button>
                  <button
                    className="btn-add-to-bag"
                    style={{
                      backgroundColor: alreadyInCart(item.product._id)
                        ? "#ffffff"
                        : "#6055d8",
                      color: alreadyInCart(item.product._id)
                        ? "#6055d8"
                        : "#ffffff",
                    }}
                    onClick={() => toggleCartButton(item.product)}
                  >
                    {alreadyInCart(item.product._id)
                      ? "Remove from Bag"
                      : "Add to Bag"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {wishlistItems.length > itemsPerPage && (
          <Stack spacing={2} sx={{ marginTop: 10, alignItems: "center" }}>
            <Pagination
              page={currentPage}
              count={totalPages}
              variant="outlined"
              shape="rounded"
              onChange={(_, page) => {
                navigate(`?page=${page}`);
              }}
            />
          </Stack>
        )}
      </section>
    </section>
  );
};

export default Wishlist;
