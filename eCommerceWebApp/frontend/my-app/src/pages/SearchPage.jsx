import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CartContext from "../store/CartContext";
import api from "../utils/api";
import Search from "./Search";
import { CiHeart } from "react-icons/ci";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { IoChevronBackOutline } from "react-icons/io5";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skeleton, setSkeleton] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeCollection, setActiveCollection] = useState(null);
  const {
    items: cartItems,
    addItemToCart,
    removeItemFromCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    setSkeleton(false);
    const fetchandSyncProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/shopify/products");
        const shopifyProducts = response?.data?.data?.products || [];

        await syncShopifyProducts(shopifyProducts);

        setProducts(shopifyProducts);
        setFilteredProducts(shopifyProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    const syncShopifyProducts = async (shopifyProducts) => {
      try {
        await api.post("/api/products/sync", { products: shopifyProducts });
      } catch (error) {
        console.error("Failed to sync shopify products:", error);
      }
    };
    fetchandSyncProducts();
  }, []);

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

      {loading ? (
        <div
          className="glide__slides"
          id="skeleton-container"
          sx={{ overflow: "hidden" }}
        >
          {Array.from(new Array(skeleton)).map((_, index) => (
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
                marginBottom: "18px",
                fontWeight: "400",
                color: "#6055d8",
              }}
            >
              <IoChevronBackOutline size={20} style={{ marginRight: "10px" }} />
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
                    <CiHeart className="heart-icon" size={25} />
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
