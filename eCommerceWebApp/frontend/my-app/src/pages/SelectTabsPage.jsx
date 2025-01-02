import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CartContext from "../store/CartContext";
import WishlistContext from "../store/WishlistContext";
import api from "../utils/api";
import { FiHeart } from "react-icons/fi";
import { IoChevronBackOutline } from "react-icons/io5";
import { Skeleton, Box } from "@mui/material";

const SelectTabsPage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [skeletonCount, setSkeletonCount] = useState(4);

  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const {
    items: cartItems,
    addItemToCart,
    removeItemFromCart,
  } = useContext(CartContext);
  const navigate = useNavigate();
  const { category } = useParams();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/api/shopify/products");
      return response?.data?.data?.products || [];
    },
    staleTime: 10 * 60 * 1000,
  });

  const filterByCategory = useCallback(
    (category) => {
      setActiveCategory(category);
      const filtered = products.filter((product) => {
        const type = product.product_type?.toLowerCase();
        const tags = Array.isArray(product.tags)
          ? product.tags.map((tag) => tag.toLowerCase())
          : product.tags?.toLowerCase().split(",") || [];

        const regex = new RegExp(`\\b${category}\\b`);
        return regex.test(type) || tags.some((tag) => regex.test(tag));
      });
      setFilteredProducts(filtered);
    },
    [products]
  );

  useEffect(() => {
    if (category) {
      filterByCategory(category);
    }
  }, [category, filterByCategory]);

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
          // price: product.variants[0].price,
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const alreadyInCart = (product) => {
    const productId = product.shopifyProductId || product.id;
    return cartItems.some(
      (item) => item.shopifyProductId === productId || item.id === productId
    );
  };

  const toggleCartButton = async (product) => {
    const productId = product.shopifyProductId || product.id;
    const cartItem = {
      id: productId,
      shopifyProductId: productId,
      shopifyVariantId: product.variants[0]?.id || null,
      title: product.title,
      price: parseFloat(product.variants[0]?.price || 0),
      quantity: 1,
      image: product.images[0]?.src || "https://via.placeholder.com/150",
    };

    if (alreadyInCart(product)) {
      removeItemFromCart(productId);
    } else {
      addItemToCart(cartItem);
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

  return (
    <section>
      <div
        className="back-to-collections"
        onClick={() => navigate("/homepage")}
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          fontWeight: "500",
          color: "#6055d8",
          marginBottom: "20px",
        }}
      >
        <IoChevronBackOutline size={20} style={{ marginRight: "10px" }} />
        Back to Home
      </div>

      <h4
        className="prod-header"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Everything {activeCategory}
      </h4>

      {isLoading ? (
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
          {filteredProducts.map((product) => (
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
                    isInWishlist(product.id) ? "rgb(251, 6, 6)" : "#ffffff"
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
                    className="btn-add-to-bag"
                    style={{
                      backgroundColor: alreadyInCart(product)
                        ? "#ffffff"
                        : "#6055d8",
                      color: alreadyInCart(product) ? "#6055d8" : "#ffffff",
                    }}
                    onClick={() => toggleCartButton(product)}
                  >
                    {alreadyInCart(product) ? "Remove from Bag" : "Add to Bag"}
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

export default SelectTabsPage;
