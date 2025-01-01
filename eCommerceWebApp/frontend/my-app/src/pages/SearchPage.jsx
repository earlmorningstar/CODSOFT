import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import CartContext from "../store/CartContext";
import WishlistContext from "../store/WishlistContext";
import api from "../utils/api";
import Search from "./Search";
import { FiHeart } from "react-icons/fi";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { IoChevronBackOutline } from "react-icons/io5";

const SearchPage = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);

  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const {
    items: cartItems,
    addItemToCart,
    removeItemFromCart,
  } = useContext(CartContext);

  const navigate = useNavigate();
  const skeletonCount = 1;

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const reponse = await api.get("/api/shopify/products");
      const shopifyProducts = reponse?.data?.data?.products || [];

      try {
        await api.post("/api/products/sync", {
          products: shopifyProducts,
        });
      } catch (error) {
        console.error("Failed to sync shopify products:", error);
      }
      return shopifyProducts;
    },
    staleTime: 10 * 60 * 1000,
  });

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

   const handleSearch = (searchTerm) => {
    setActiveCollection(null);
    const trimmedSearch = searchTerm.trim().toLowerCase();
    setIsSearching(trimmedSearch !== "");

    // let filtered = [];

    if (trimmedSearch) {
      const filtered = products.filter((product) => {
        const titleMatch = product.title?.toLowerCase().includes(trimmedSearch);
        const typeMatch = product.product_type
          ?.toLowerCase()
          .includes(trimmedSearch);
        const tagsMatch =
          (typeof product.tags === "string" &&
            product.tags.toLowerCase().includes(trimmedSearch)) ||
          (Array.isArray(product.tags) &&
            product.tags.some((tag) =>
              tag.toLowerCase().includes(trimmedSearch)
            ));
        return titleMatch || typeMatch || tagsMatch;
      });

      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleCollectionClick = (collection) => {
    setActiveCollection(collection);
    setIsSearching(true);
    const filtered = products.filter(
      (product) =>
        product.product_type?.toLowerCase() === collection.toLowerCase()
    );
    setFilteredProducts(filtered);
  };

  const handleBackToCollections = () => {
    setActiveCollection(null);
    setIsSearching(false);
    setFilteredProducts(products);
  };

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

    try {
      const mongoProductResponse = await api.get(
        `/api/products/shopify/${product.id}`
      );
      const mongoProduct = mongoProductResponse.data.data;

      if (!mongoProduct) {
        await api.post("/api/products/sync", {
          products: [product],
        });
      }
    } catch (error) {
      console.warm("Could not sync product:", error);
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <section>
      <h4
        className="prod-header"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Discover our collections
      </h4>
      <Search onSearch={handleSearch} />

      {isLoading ? (
        <div
          className="glide__slides"
          id="skeleton-container"
          sx={{ overflow: "hidden" }}
        >
          {Array.from(new Array(skeletonCount)).map((_, index) => (
            <Box key={index} sx={{ width: "100%" }}>
              <Skeleton animation="wave" height={70} width="100%" />
              <Skeleton animation="wave" height={70} width="100%" />
              <Skeleton animation="wave" height={70} width="100%" />
              <Skeleton animation="wave" height={70} width="100%" />
              <Skeleton animation="wave" height={70} width="100%" />
            </Box>
          ))}
        </div>
      ) : (
        <>
          {activeCollection && (
            <div
              className="back-to-collections"
              onClick={handleBackToCollections}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: "500",
                color: "#6055d8",
              }}
            >
              <IoChevronBackOutline
                size={20}
                style={{
                  marginRight: "10px",
                }}
              />
              Back to Collections
            </div>
          )}
          {isSearching && filteredProducts.length > 0 && (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <div className="productList-card" key={product.id}>
                  <div className="prod-img-container">
                    <img
                      src={
                        product.image?.src || "https://via.placeholder.com/150"
                      }
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
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="btn-add-to-bag"
                        style={{
                          backgroundColor: alreadyInCart(product.id)
                            ? "#ffffff"
                            : "#6055d8",
                          color: alreadyInCart(product.id)
                            ? "#6055d8"
                            : "#ffffff",
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

          {!isSearching && (
            <div className="searchPage-collection-container">
              {[
                "Clothing",
                "Shoes",
                "Electronics",
                "Accessories",
                "Furniture",
              ].map((collection) => (
                <span
                  key={collection}
                  onClick={() => handleCollectionClick(collection)}
                >
                  {collection}
                </span>
              ))}
            </div>
          )}

          {isSearching && filteredProducts.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No products found for your search.
            </p>
          )}
        </>
      )}
    </section>
  );
};

export default SearchPage;
