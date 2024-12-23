import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CartContext from "../store/CartContext";
import api from "../utils/api";
import { CiHeart } from "react-icons/ci";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Search from "./Search";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(4);
  const [error, setError] = useState(null);
  const {
    items: cartItems,
    addItemToCart,
    removeItemFromCart,
  } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const productsPerPage = 16;
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get("page") || "1", 10);

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
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/shopify/products");
        const fetchedProducts = response?.data?.data?.products || [];

        await syncShopifyProducts(fetchedProducts);

        setProducts(fetchedProducts);
        setFilteredproducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products.");
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const syncShopifyProducts = async (shopifyProducts) => {
    try {
      const response = await api.post("/api/products/sync", {
        products: shopifyProducts,
      });
      console.log("Product sync response:", response.data);
    } catch (error) {
      console.error("Failed to sync Shopify products:", error);
    }
  };

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleSearch = (searchTerm) => {
    let filtered = [];

    if (searchTerm) {
      const lowercasedValue = searchTerm.toLowerCase().trim();
      filtered = products.filter((product) => {
        const titleMatch =
          product.title?.toLowerCase().trim().includes(lowercasedValue) ||
          false;
        const typeMatch =
          product.product_type
            ?.toLowerCase()
            .trim()
            .includes(lowercasedValue) || false;

        const tagsMatch =
          (typeof product.tags === "string"
            ? product.tags.toLowerCase().trim().includes(lowercasedValue)
            : Array.isArray(product.tags) &&
              product.tags.some((tag) =>
                tag?.toLowerCase().trim().includes(lowercasedValue)
              )) || false;
        return titleMatch || typeMatch || tagsMatch;
      });
    } else {
      filtered = products;
    }
    setFilteredproducts(filtered);
    navigate("?page=1");
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
      <Search onSearch={handleSearch} />

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
          {currentProducts.map((product) => (
            <div className="productList-card" key={product.id}>
              <div className="prod-img-container">
                <img
                  src={product.image?.src || "https://via.placeholder.com/150"}
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
                  <button onClick={() => navigate(`/products/${product.id}`)}>
                    View Details
                  </button>
                  <button
                    className="btn-add-to-bag"
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
    </section>
  );
};

export default ProductsPage;
