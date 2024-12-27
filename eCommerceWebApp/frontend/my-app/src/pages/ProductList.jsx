import { useEffect, useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import WishlistContext from "../store/WishlistContext";
import { FiHeart } from "react-icons/fi";
import { IoIosArrowRoundDown } from "react-icons/io";
import CartContext from "../store/CartContext";
import Skeleton from "@mui/material/Skeleton"; 
import Box from "@mui/material/Box";

const ProductList = ({ products }) => {
  const [randomProducts, setRandomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(4);
  const {
    items: cartItems,
    addItemToCart,
    removeItemFromCart,
  } = useContext(CartContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const navigate = useNavigate();

  const toggleWishlist = async (product) => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id.toString());
      } else {
        await addToWishlist({
          id: product.id,
          title: product.title,
          variants: product.variants,
          images: product.images,
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const updateSkeletonCount = () => {
    const width = window.innerWidth;
    if (width > 1140) {
      setSkeletonCount(4);
    } else if (width > 900) {
      setSkeletonCount(3);
    } else if (width > 700) {
      setSkeletonCount(2);
    } else {
      setSkeletonCount(1);
    }
  };

  useEffect(() => {
    updateSkeletonCount();
    window.addEventListener("resize", updateSkeletonCount);
    return () => window.removeEventListener("resize", updateSkeletonCount);
  }, []);

  useEffect(() => {
    if (products?.length > 0) {
      setTimeout(() => {
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setRandomProducts(shuffled.slice(0, 12));
        setLoading(false);
      }, 1500);
    }
  }, [products, skeletonCount]);

  const alreadyInCart = (id) => {
    return cartItems.some((item) => item.id === id);
  };

  const toggleCartButton = (product) => {
    if (alreadyInCart(product.id)) {
      removeItemFromCart(product.id);
    } else {
      addItemToCart({
        id: product.id,
        title: product.title,
        price: parseFloat(product.variants[0]?.price || 0),
        quantity: 1,
        image: product.image?.src || "https://via.placeholder.com/150",
      });
    }
  };

  return (
    <section className="prod-main-container">
      <div className="prod-header-nav-flex-container">
        <h4 className="prod-header">Explore Products</h4>
        <NavLink className="view-prod-link" to="/products">
          <span className="view-prod-link-holder">
            View More Products <IoIosArrowRoundDown size={25} />
          </span>
        </NavLink>
      </div>

      {loading ? (
        <div
          className="glide__slides"
          id="skeleton-container"
          sx={{ overflow: "hidden" }}
        >
          {Array.from(new Array(skeletonCount)).map((_, index) => (
            <Box key={index} sx={{ width: "100%" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                animation="wave"
              />
              <Skeleton
                animation="wave"
                height={20}
                width="60%"
                style={{ marginTop: 8 }}
              />
              <Skeleton animation="wave" height={130} width="100%" />
              <Skeleton animation="wave" height={20} width="20%" />
              <Skeleton animation="wave" height={45} width="100%" />
              <Skeleton animation="wave" height={45} width="100" />
            </Box>
          ))}
        </div>
      ) : (
        <div className="product-grid">
          {randomProducts.map((product) => (
            <div className="productList-card" key={product.id}>
              <div className="prod-img-container">
                <img
                  src={product.image?.src || "https://via.placeholder.com/150"}
                  alt={product.title}
                  className="product-image"
                />
                <FiHeart
                        className={`heart-icon ${
                          isInWishlist(product.id) ? "active" : ""
                        }`}
                        size={25}
                        color={
                          isInWishlist(product.id)
                            ? "rgb(251, 6, 6)"
                            : "#ffffff"
                        }
                        onClick={() => toggleWishlist(product)}
                      />
              </div>

              <div className="product-details">
                <span>{product.title}</span>
                <aside>
                  <h5>
                    {product.body_html
                      ?.replace(/<\/?[^>]+(>|$)/g, "")
                      .slice(0, 100) || "No description available..."}
                    ...
                  </h5>
                </aside>

                <p>${product.variants[0]?.price || "No Available Price"}</p>
                <div className="product-actions">
                  <button onClick={() => navigate(`/products/${product.id}`)}>
                    View Details
                  </button>
                  <button
                    style={{
                      backgroundColor: alreadyInCart(product.id)
                        ? "#ffffff"
                        : "#6055d8",
                      color: alreadyInCart(product.id) ? "#6055d8" : "#ffffff",
                    }}
                    onClick={() => toggleCartButton(product)}
                  >
                    {alreadyInCart(product.id)
                      ? "Remove from Bag"
                      : "Add to Bag"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
