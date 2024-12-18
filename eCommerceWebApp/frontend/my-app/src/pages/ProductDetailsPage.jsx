import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import CartContext from "../store/CartContext";
import api from "../utils/api";
import { CiHeart } from "react-icons/ci";
import { MdKeyboardBackspace } from "react-icons/md";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [skeleton, setSkeleton] = useState(true);
  const {
    items: cartItems,
    addItemToCart,
    removeItemFromCart,
  } = useContext(CartContext);
  const navigate = useNavigate();

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    setSkeleton(false);
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/shopify/products/${id}`);
        const fetchExactProduct = response?.data?.data?.product;
        setProduct(fetchExactProduct);
      } catch (error) {
        console.error("Error fetching Product Details:", error);
        setError("Failed to fetch products details");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

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

  const handleCartPage = () => {
    navigate("/cart");
  };

  if (error) return <p>{error}</p>;

  return (
    <>
      {loading ? (
        <div
          className="glide__slides"
          id="skeleton-container"
          sx={{ overflow: "hidden" }}
        >
          {Array.from(new Array(skeleton)).map((_, index) => (
            <Box key={index} sx={{ width: "100%" }}>
              <span>
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={300}
                  animation="wave"
                />
              </span>
              <span>
                <Skeleton animation="wave" height={20} width="80%" />
                <Skeleton animation="wave" height={60} width="40%" />
                <Skeleton animation="wave" height={100} width="100%" />
                <Skeleton animation="wave" height={45} width="40%" />
                <Skeleton animation="wave" height={45} width="40%" />
                <Skeleton animation="wave" height={45} width="60" />
                <Skeleton animation="wave" height={45} width="60" />
              </span>
            </Box>
          ))}
        </div>
      ) : (
        <section className="product-details-container">
          <div className="product-details-img-container">
            <img
              src={product?.image?.src || "https://via.placeholder.com/150"}
              alt={product?.title}
              className="product-detail-image"
            />
            <div>
              <NavLink className="prod-detail-back-arrow" to="/homepage">
                <MdKeyboardBackspace color="#111111" size={25} />
              </NavLink>
              <CiHeart className="prod-detail-heart-icon" size={30} />
            </div>
          </div>

          <div className="product-details-info-container">
            <div className="product-title-price-container">
              <span>
                <h4>{product?.title || "Product Details"}</h4>
                <p className="product-detail-price" id="prod-price-1">
                  ${product?.variants?.[0]?.price || "N/A"}
                </p>
              </span>
            </div>
            <h5>{product?.tags || "No tags available"}</h5>

            <div className="product-detail-desc-holder">
              <p>
                {product?.body_html?.replace(/<\/?[^>]+(>|$)/g, "") ||
                  "No description available."}
              </p>
            </div>

            <p className="product-detail-price" id="prod-price-2">
              ${product?.variants?.[0]?.price || "N/A"}
            </p>

            <div className="product-detail-code-qty-holder">
              <p>Product Code: {product?.variants?.[0]?.sku || "N/A"}</p>
              <p>
                Quantity Available:{" "}
                {product?.variants?.[0]?.inventory_quantity || "N/A"}
              </p>
            </div>
            <div className="product-size-container">
              <p>Size</p>
              <span>
                {["s", "m", "l", "xl", "xxl"].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeClick(size)}
                    style={{
                      backgroundColor:
                        selectedSize === size ? "#6055d8" : "transparent",
                      color: selectedSize === size ? "#ffffff" : "#000000",
                    }}
                  >
                    {size}
                  </button>
                ))}
              </span>
            </div>
            <div className="product-detail-actions">
              <button
                style={{
                  backgroundColor: alreadyInCart(product.id)
                    ? "#ffffff"
                    : "#6055d8",
                  color: alreadyInCart(product.id) ? "#6055d8" : "#ffffff",
                }}
                onClick={() => toggleCartButton(product)}
              >
                Add to Bag
              </button>
              <button onClick={handleCartPage}>View Cart</button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductDetailsPage;
